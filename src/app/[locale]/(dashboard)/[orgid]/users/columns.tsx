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
} from "@/components/ui/Select";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRefresh } from "./refresh-context";

interface RoleOption {
  id: string;
  name: string;
}

/** ✅ Extracted Role Cell Component */
function RoleCell({ user }: { user: UserWithRole }) {
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

    if (isEditing) fetchRoles();
  }, [isEditing, orgid]);

  const handleRoleChange = async (newRoleId: string) => {
    try {
      await updateUserRole(user.id, orgid as string, newRoleId);
      const selectedRole = roles.find((r) => r.id === newRoleId);
      setRole(selectedRole?.name || "No Role");
      setIsEditing(false);
    } catch (error) {
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
        <Select onValueChange={handleRoleChange} value={user.role?.id || ""}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Remove Role</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
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
      <Badge variant="outline">{role}</Badge>
      {session?.user?.id !== user.id && (
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      )}
    </div>
  );
}

/** ✅ Extract Actions Cell Component */
function ActionsCell({ user }: { user: UserWithRole }) {
  const { orgid } = useParams();
  const { data: session } = useSession();
  const refreshUsers = useRefresh();

  if (session?.user?.id === user.id) return null;

  const handleRemoveUser = async () => {
    if (confirm(`Remove ${user.name || user.email}?`)) {
      try {
        await removeUserFromOrganization(user.id, orgid as string);
        toast.success("User removed successfully");
        refreshUsers();
      } catch (error) {
        toast.error("Error removing user: " + (error as Error).message);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
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
}

export const columns: ColumnDef<UserWithRole>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => <RoleCell user={row.original} />, // ✅ Now valid
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell user={row.original} />, // ✅ Also valid
  },
];
