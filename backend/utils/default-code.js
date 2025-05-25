export const defaultStarterCode = {
    python: `def solution():
    pass

result = solution()
print(result)`,
    c: `#include <stdio.h>

int solution() {
    return 0;
}

int main() {
    int result = solution();
    printf("%d\\n", result);
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int solution() {
    return 0;
}

int main() {
    int result = solution();
    cout << result << endl;
    return 0;
}`,
    java: `import java.util.Scanner;

public class Solution {
    public static int solution() {
        return 0;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int result = solution();
        System.out.println(result);
        scanner.close();
    }
}`,
};
