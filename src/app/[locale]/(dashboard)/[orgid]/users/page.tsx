"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { UserWithRole } from "./types";
import { getUsersByOrganization } from "./actions";
import { AddUserDialog } from "./add-user-dialog";
import { RefreshProvider } from "./refresh-context";

export default function UsersPage() {
  const { orgid } = useParams();
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgid) {
      loadUsers();
    }
  }, [orgid]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersByOrganization(orgid as string);
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = () => {
    loadUsers(); // Refresh the user list after adding a new user
  };

  const handleUserRemoved = () => {
    loadUsers(); // Refresh the user list after removing a user
  };

  return (
    <RefreshProvider onRefresh={handleUserRemoved}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">User Management</CardTitle>
            <AddUserDialog onUserAdded={handleUserAdded} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading users...</p>
              </div>
            ) : (
              <DataTable columns={columns} data={users} />
            )}
          </CardContent>
        </Card>
      </div>
    </RefreshProvider>
  );
}