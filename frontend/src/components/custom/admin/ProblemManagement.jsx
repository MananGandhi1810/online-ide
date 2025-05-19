import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

function ProblemManagement({ token }) {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState(""); // Filter by difficulty
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    testCases: [{ input: "", output: "", hidden: true }],
  });
  const { toast } = useToast();

  

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.SERVER_URL}/problem-statement/all`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        validateStatus: false,
      });

      if (response.data.success) {
        setProblems(response.data.data.problemStatements);
        setFilteredProblems(response.data.data.problemStatements);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to fetch problems",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load problems",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = [...problems];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        problem => 
          problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          problem.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (difficulty) {
      filtered = filtered.filter(problem => problem.difficulty === difficulty);
    }
    
    setFilteredProblems(filtered);
  };
  
  useEffect(() => {
    fetchProblems();
  }, [token]);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, difficulty]);


  const handleCreateProblem = async () => {
    try {
      // Check for any empty test cases
      const hasEmptyTestCase = formData.testCases.some(tc => !tc.input || !tc.output);
      
      if (hasEmptyTestCase) {
        toast({
          title: "Validation Error",
          description: "All test cases must have input and output values",
          variant: "destructive",
        });
        return;
      }

      const endpoint = editMode 
        ? `${process.env.SERVER_URL}/problem-statement/edit/${currentProblem.id}`
        : `${process.env.SERVER_URL}/problem-statement/new`;
      
      const method = editMode ? 'put' : 'post';
      
      const response = await axios[method](
        endpoint,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          validateStatus: false,
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: editMode 
            ? "Problem statement updated successfully" 
            : "Problem statement created successfully",
        });
        
        setOpenDialog(false);
        resetForm();
        fetchProblems();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to save problem statement",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save problem statement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProblem = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.SERVER_URL}/problem-statement/delete/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          validateStatus: false,
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Problem statement deleted successfully",
        });
        fetchProblems();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to delete problem statement",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete problem statement",
        variant: "destructive",
      });
    }
  };

  const editProblem = async (problem) => {
    try {
      // First fetch the problem with test cases
      const response = await axios.get(
        `${process.env.SERVER_URL}/problem-statement/${problem.id}?withHidden=true`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          validateStatus: false,
        }
      );

      if (response.data.success) {
        const fullProblem = response.data.data.problemStatement;
        
        setCurrentProblem(fullProblem);
        setFormData({
          title: fullProblem.title,
          description: fullProblem.description,
          difficulty: fullProblem.difficulty,
          testCases: fullProblem.testCase.map(tc => ({
            input: tc.input,
            output: tc.output,
            hidden: tc.hidden
          }))
        });
        
        setEditMode(true);
        setOpenDialog(true);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to fetch problem details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load problem details",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "Easy",
      testCases: [{ input: "", output: "", hidden: true }],
    });
    setEditMode(false);
    setCurrentProblem(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (value) => {
    setFormData(prev => ({ ...prev, difficulty: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    
    if (field === "hidden") {
      updatedTestCases[index].hidden = value;
    } else {
      updatedTestCases[index][field] = value;
    }
    
    setFormData(prev => ({ ...prev, testCases: updatedTestCases }));
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "", hidden: true }]
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length <= 1) {
      toast({
        title: "Validation Error",
        description: "At least one test case is required",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, testCases: updatedTestCases }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Problem Management</CardTitle>
          <CardDescription>Create and manage coding challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={fetchProblems} size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditMode(false); resetForm(); }}>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Problem
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editMode ? "Edit Problem Statement" : "Create New Problem Statement"}
                    </DialogTitle>
                    <DialogDescription>
                      {editMode
                        ? "Update the details of this coding challenge"
                        : "Add a new coding challenge to the platform"
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Problem title"
                        className="col-span-3"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="difficulty" className="text-right">
                        Difficulty
                      </Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={handleDifficultyChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Problem description and requirements..."
                        className="col-span-3 min-h-24"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <div className="text-right">
                        <Label>Test Cases</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          At least one test case is required
                        </p>
                      </div>
                      
                      <div className="col-span-3 space-y-4">
                        {formData.testCases.map((testCase, index) => (
                          <Card key={index}>
                            <CardHeader className="p-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-sm">Test Case {index + 1}</CardTitle>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTestCase(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <div className="space-y-2">
                                <div>
                                  <Label htmlFor={`input-${index}`}>Input</Label>
                                  <Textarea
                                    id={`input-${index}`}
                                    placeholder="Test case input"
                                    value={testCase.input}
                                    onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                                    className="min-h-16"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`output-${index}`}>Expected Output</Label>
                                  <Textarea
                                    id={`output-${index}`}
                                    placeholder="Expected output"
                                    value={testCase.output}
                                    onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                                    className="min-h-16"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`hidden-${index}`}
                                    checked={testCase.hidden}
                                    onChange={(e) => handleTestCaseChange(index, "hidden", e.target.checked)}
                                  />
                                  <Label htmlFor={`hidden-${index}`}>Hidden from users</Label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button
                          variant="outline"
                          onClick={addTestCase}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Test Case
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProblem}>
                      {editMode ? "Update Problem" : "Create Problem"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading problems...</div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Test Cases</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem) => (
                      <TableRow key={problem.id}>
                        <TableCell className="font-medium">{problem.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              problem.difficulty === "Easy" 
                                ? "border-green-500 text-green-500" 
                                : problem.difficulty === "Medium"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-red-500 text-red-500"
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>{problem.testCase?.length || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editProblem(problem)}
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProblem(problem.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No problems found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProblemManagement;
