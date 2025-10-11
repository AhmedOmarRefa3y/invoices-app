"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUserToOrganization, getAllUsersNotInOrganization, getRolesByOrganization } from "./actions";
import { useParams } from "next/navigation";

interface AddUserDialogProps {
  onUserAdded: () => void;
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const { orgid } = useParams();
  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [users, setUsers] = useState<{id: string, email: string, name: string | null}[]>([]);
  const [roles, setRoles] = useState<{id: string, name: string}[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    if (open) {
      loadUsersAndRoles();
    }
  }, [open, orgid]);

  const loadUsersAndRoles = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        getAllUsersNotInOrganization(orgid as string),
        getRolesByOrganization(orgid as string)
      ]);
      
      setUsers(usersData);
      setRoles(rolesData);
      setSelectedUserId(null);
      setRoleId(null);
      setSearchEmail("");
    } catch (error) {
      console.error("Error loading users and roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!selectedUserId) {
        alert("Please select a user");
        return;
      }
      
      await addUserToOrganization(selectedUserId, orgid as string, roleId);
      setOpen(false);
      setSelectedUserId(null);
      setRoleId(null);
      onUserAdded();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user: " + (error as Error).message);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User to Organization</DialogTitle>
          <DialogDescription>
            Search for a user by email and assign a role.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              User Email
            </Label>
            <Input
              id="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="col-span-3"
              placeholder="user@example.com"
            />
          </div>
          
          {searchEmail && filteredUsers.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Select User
              </Label>
              <div className="col-span-3 space-y-2 max-h-32 overflow-y-auto">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={`p-2 rounded cursor-pointer ${selectedUserId === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="font-medium">{user.name || user.email}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedUserId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={roleId || ""} onValueChange={(value) => setRoleId(value || null)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Role</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddUser} disabled={!selectedUserId}>
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}