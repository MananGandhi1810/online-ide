# Admin Panel for Online IDE

This documentation provides details about the admin panel features and setup process.

## Features

The admin panel provides the following features:

1. **Dashboard**
   - Overview of platform statistics
   - User counts, submissions, and problem statistics
   - Recent registration trends

2. **User Management**
   - View all users
   - Grant or revoke admin privileges
   - Filter users by status (admin, unverified)
   - Search for specific users

3. **Problem Management**
   - Create new problem statements
   - Edit existing problems
   - Delete problems
   - Manage test cases with hidden/visible settings

## Setup Process

### Initial Admin Setup

To set up the first admin in the system:

1. Configure the environment variable in your `.env` file:

   ``` bash
   ADMIN_EMAIL=your_admin_email@example.com
   ``` bash
   This email should belong to a registered user in the system.

2. Navigate to `/setup-admin` in your browser.

3. Click the "Create First Admin" button. This will convert the user with the specified email into an admin.

4. This setup can be performed only once when there are no existing admins in the system.

### Creating Additional Admins

Once you have an admin account:

1. Log in to your admin account.
2. Navigate to the Admin Panel.
3. Go to the "User Management" tab.
4. Find the user you want to make an admin.
5. Click the "Shield" icon to grant admin privileges.

## Security Considerations

- Admin privileges should be granted carefully as admins have full control over the platform.
- Only admins can access the admin panel.
- All admin actions are protected by authentication middleware on the server.

## Development Notes

### Frontend

The admin panel is implemented in React and uses the Shadcn UI component library. The main components are:

- `AdminPanel.jsx` - Main container component
- `AdminDashboard.jsx` - Dashboard with statistics
- `UserManagement.jsx` - User listing and management
- `ProblemManagement.jsx` - Problem statement management

### Backend

The admin API routes are protected by the `checkAuth` middleware with the `admin` parameter set to `true`. This ensures that only users with the admin flag set to `true` can access these routes.

Key backend files:

- `router/admin.js` - Admin API routes
- `handlers/admin.js` - Admin route handlers
- `router/setup.js` - Setup routes for initial admin creation
- `middlewares/auth.js` - Authentication middleware with admin check
