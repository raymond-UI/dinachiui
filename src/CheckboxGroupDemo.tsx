import * as React from "react";
import { CheckboxGroup } from "@dinachi/components/checkbox-group";
import { Checkbox } from "@dinachi/components/checkbox";

export function CheckboxGroupDemo() {
  const [selectedFruits, setSelectedFruits] = React.useState<string[]>(["fuji-apple"]);
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);
  const [selectedUserPermissions, setSelectedUserPermissions] = React.useState<string[]>([]);
  
  // State for complex nested example
  const [selectedDashboardFeatures, setSelectedDashboardFeatures] = React.useState<string[]>([]);
  const [selectedReportFeatures, setSelectedReportFeatures] = React.useState<string[]>([]);
  const [selectedAdminFeatures, setSelectedAdminFeatures] = React.useState<string[]>([]);

  const fruits = ['fuji-apple', 'gala-apple', 'granny-smith-apple'];
  const userPermissions = ['create-user', 'edit-user', 'delete-user'];

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Checkbox Group Demo</h2>

      {/* Basic Checkbox Group */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Example</h3>
        <CheckboxGroup
          aria-labelledby="apples-caption"
          defaultValue={['fuji-apple']}
          className="flex flex-col items-start gap-2 text-gray-900"
        >
          <div className="font-medium mb-2" id="apples-caption">
            Apples
          </div>

          <label className="flex items-center gap-2">
            <Checkbox name="apple" value="fuji-apple" />
            <span>Fuji</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox name="apple" value="gala-apple" />
            <span>Gala</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox name="apple" value="granny-smith-apple" />
            <span>Granny Smith</span>
          </label>
        </CheckboxGroup>
      </div>

      {/* Controlled Parent Checkbox */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Parent Checkbox Example</h3>
        <CheckboxGroup
          aria-labelledby="controlled-apples-caption"
          value={selectedFruits}
          onValueChange={setSelectedFruits}
          allValues={fruits}
          className="flex flex-col items-start gap-2 text-gray-900"
          style={{ marginLeft: '1rem' }}
        >
          <label
            className="flex items-center gap-2 font-medium"
            id="controlled-apples-caption"
            style={{ marginLeft: '-1rem' }}
          >
            <Checkbox name="apples" parent />
            <span>Apples</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox value="fuji-apple" />
            <span>Fuji</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox value="gala-apple" />
            <span>Gala</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox value="granny-smith-apple" />
            <span>Granny Smith</span>
          </label>
        </CheckboxGroup>
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedFruits.join(", ") || "None"}
        </p>
      </div>

      {/* Disabled Checkbox Group */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Disabled Example</h3>
        <CheckboxGroup
          defaultValue={["permission1"]}
          disabled
          className="flex flex-col items-start gap-2 text-gray-900"
        >
          <div className="font-medium mb-2">Permissions (Disabled)</div>
          
          <label className="flex items-center gap-2">
            <Checkbox value="permission1" />
            <span>View Dashboard</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox value="permission2" />
            <span>Manage Users</span>
          </label>
        </CheckboxGroup>
      </div>

      {/* Nested Parent Checkbox - User Permissions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Nested Parent Checkbox Example</h3>
        <CheckboxGroup
          value={selectedPermissions}
          onValueChange={setSelectedPermissions}
          className="flex flex-col items-start gap-2 text-gray-900"
        >
          <div className="font-medium mb-2">System Permissions</div>
          
          <label className="flex items-center gap-2">
            <Checkbox value="view-dashboard" />
            <span>View Dashboard</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox value="access-reports" />
            <span>Access Reports</span>
          </label>

          {/* Nested User Management Section */}
          <div className="ml-4 mt-2">
            <CheckboxGroup
              value={selectedUserPermissions}
              onValueChange={setSelectedUserPermissions}
              allValues={userPermissions}
              className="flex flex-col items-start gap-2 text-gray-900"
              style={{ marginLeft: '1rem' }}
            >
              <label
                className="flex items-center gap-2 font-medium"
                style={{ marginLeft: '-1rem' }}
              >
                <Checkbox name="user-management" parent />
                <span>Manage Users</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="create-user" />
                <span>Create User</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="edit-user" />
                <span>Edit User</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="delete-user" />
                <span>Delete User</span>
              </label>
            </CheckboxGroup>
          </div>

          <label className="flex items-center gap-2">
            <Checkbox value="assign-roles" />
            <span>Assign Roles</span>
          </label>
        </CheckboxGroup>
        <p className="mt-2 text-sm text-gray-600">
          Main Permissions: {selectedPermissions.join(", ") || "None"}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          User Management: {selectedUserPermissions.join(", ") || "None"}
        </p>
      </div>

      {/* Complex Nested Example - Multiple Levels */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Complex Nested Parent Example</h3>
        <div className="space-y-4">
          <div className="font-medium">Application Features</div>
          
          {/* Dashboard Section */}
          <div>
            <CheckboxGroup
              value={selectedDashboardFeatures}
              onValueChange={setSelectedDashboardFeatures}
              allValues={['dashboard-view', 'dashboard-edit', 'dashboard-share']}
              className="flex flex-col items-start gap-2"
              style={{ marginLeft: '1rem' }}
            >
              <label
                className="flex items-center gap-2 font-medium"
                style={{ marginLeft: '-1rem' }}
              >
                <Checkbox name="dashboard" parent />
                <span>Dashboard</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="dashboard-view" />
                <span>View Dashboard</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="dashboard-edit" />
                <span>Edit Dashboard</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="dashboard-share" />
                <span>Share Dashboard</span>
              </label>
            </CheckboxGroup>
            <p className="mt-1 ml-4 text-sm text-gray-600">
              Dashboard: {selectedDashboardFeatures.join(", ") || "None"}
            </p>
          </div>

          {/* Reports Section */}
          <div>
            <CheckboxGroup
              value={selectedReportFeatures}
              onValueChange={setSelectedReportFeatures}
              allValues={['reports-view', 'reports-export', 'reports-schedule']}
              className="flex flex-col items-start gap-2"
              style={{ marginLeft: '1rem' }}
            >
              <label
                className="flex items-center gap-2 font-medium"
                style={{ marginLeft: '-1rem' }}
              >
                <Checkbox name="reports" parent />
                <span>Reports</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="reports-view" />
                <span>View Reports</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="reports-export" />
                <span>Export Reports</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="reports-schedule" />
                <span>Schedule Reports</span>
              </label>
            </CheckboxGroup>
            <p className="mt-1 ml-4 text-sm text-gray-600">
              Reports: {selectedReportFeatures.join(", ") || "None"}
            </p>
          </div>

          {/* Admin Section */}
          <div>
            <CheckboxGroup
              value={selectedAdminFeatures}
              onValueChange={setSelectedAdminFeatures}
              allValues={['admin-users', 'admin-settings', 'admin-logs']}
              className="flex flex-col items-start gap-2"
              style={{ marginLeft: '1rem' }}
            >
              <label
                className="flex items-center gap-2 font-medium"
                style={{ marginLeft: '-1rem' }}
              >
                <Checkbox name="admin" parent />
                <span>Administration</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="admin-users" />
                <span>Manage Users</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="admin-settings" />
                <span>System Settings</span>
              </label>

              <label className="flex items-center gap-2">
                <Checkbox value="admin-logs" />
                <span>View Logs</span>
              </label>
            </CheckboxGroup>
            <p className="mt-1 ml-4 text-sm text-gray-600">
              Admin: {selectedAdminFeatures.join(", ") || "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}