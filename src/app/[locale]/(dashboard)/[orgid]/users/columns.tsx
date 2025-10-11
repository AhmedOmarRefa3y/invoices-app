"use client";

"use client";

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { updateUserRole, getRolesByOrganization, removeUserFromOrganization } from "./actions";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRefresh } from "./page";

interface RoleOption {
  id: string;
  name: string;
}

export const columns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const { orgid } = useParams();
      const { data: session } = useSession();
      const [role, setRole] = useState(user.role?.name || "No Role");
      const [isEditing, setIsEditing] = useState(false);
      const [roles, setRoles] = useState<RoleOption[]>([]);

      useEffect(() => {
        const fetchRoles = async () => {
          try {
            const rolesData = await getRolesByOrganization(orgid as string);
            setRoles(rolesData);
          } catch (error) {
            console.error("Error fetching roles:", error);
          }
        };
        
        if (isEditing) {
          fetchRoles();
        }
      }, [isEditing, orgid]);

      const handleRoleChange = async (newRoleId: string) => {
        try {
          await updateUserRole(user.id, orgid as string, newRoleId);
          // Update the current role name based on the selected role ID
          const selectedRole = roles.find(r => r.id === newRoleId);
          setRole(selectedRole?.name || "No Role");
          setIsEditing(false);
        } catch (error) {
          console.error("Error updating role:", error);
          toast.error("Error updating role: " + (error as Error).message);
        }
      };

      const handleCancel = () => {
        setIsEditing(false);
        setRole(user.role?.name || "No Role");
      };

      if (isEditing) {
        return (
          <div className="flex items-center space-x-2">
            <Select 
              onValueChange={(value) => handleRoleChange(value)} 
              value={user.role?.id || ""}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Remove Role</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        );
      }

      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {user.role?.name || "No Role"}
          </Badge>
          {session?.user?.id !== user.id && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const { orgid } = useParams();
      const { data: session } = useSession();
      const refreshUsers = useRefresh();

      // Prevent users from removing themselves
      if (session?.user?.id === user.id) {
        return null;
      }

      const handleRemoveUser = async () => {
        if (confirm(`Are you sure you want to remove ${user.name || user.email} from this organization?`)) {
          try {
            await removeUserFromOrganization(user.id, orgid as string);
            toast.success("User removed successfully");
            // Use the refresh function passed from the parent
            refreshUsers();
          } catch (error) {
            console.error("Error removing user:", error);
            toast.error("Error removing user: " + (error as Error).message);
          }
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
              onClick={handleRemoveUser}
            >
              Remove from Organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];