"use client";

import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { components } from "@/lib/api/types";
import { $api } from "@/lib/api";
import { useMe } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";

type User = components["schemas"]["User"];
type UserRole = components["schemas"]["UserRole"];

type NewUser = {
  email: string;
  role: UserRole;
  name?: string;
};

export default function AdminDashboard() {
  const t = useTranslations('admin.users');
  const me = useMe();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    role: "hr",
    name: ""
  });

  // Fetch users list
  const { data: users, isLoading: isLoadingUsers } = $api.useQuery("get", "/users/", {});

  // Create new HR user mutation
  const { mutate: createUser, isPending: isCreatingUser } = $api.useMutation("post", "/users/new-hr");

  // Update user role mutation  
  const { mutate: updateUserRole, isPending: isUpdatingRole } = $api.useMutation("post", "/users/promote");

  // Handle form input changes
  const handleEmailChange = (email: string) => {
    setNewUser(prev => ({ ...prev, email }));
  };

  const handleNameChange = (name: string) => {
    setNewUser(prev => ({ ...prev, name }));
  };

  const handleRoleChange = (role: UserRole) => {
    setNewUser(prev => ({ ...prev, role }));
  };

  // Handle new user submission
  const handleSubmit = () => {
    createUser({
      body: {
        email: newUser.email,
        name: newUser.name || null
      }
    }, {
      onSuccess: () => {
        setIsAddUserOpen(false);
        setNewUser({ email: "", role: "hr", name: "" });
      }
    });
  };

  // Handle role change
  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
    updateUserRole({
      params: {
        query: {
          target_user_id: userId,
          role: newRole
        }
      }
    });
  };

  // Show loading state while fetching users
  if (isLoadingUsers) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => setIsAddUserOpen(true)}>{t('addUser')}</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('role')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name || "-"}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={user.role}
                    onValueChange={(value: UserRole) => handleRoleUpdate(user.id, value)}
                    disabled={user.id === me?.id} // Prevent changing own role
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">{t('roles.HR')}</SelectItem>
                      <SelectItem value="manager">{t('roles.MANAGER')}</SelectItem>
                      <SelectItem value="admin">{t('roles.ADMIN')}</SelectItem>
                      <SelectItem value="banned">{t('roles.BANNED')}</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {isUpdatingRole && <Loader2 className="h-4 w-4 animate-spin" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialog.add.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('dialog.add.emailLabel')}</label>
              <Input
                type="email"
                placeholder={t('dialog.add.emailPlaceholder')}
                value={newUser.email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('dialog.add.nameLabel')}</label>
              <Input
                type="text"
                placeholder={t('dialog.add.namePlaceholder')}
                value={newUser.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('dialog.add.roleLabel')}</label>
              <Select
                defaultValue={newUser.role}
                onValueChange={(value: UserRole) => handleRoleChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr">{t('roles.HR')}</SelectItem>
                  <SelectItem value="manager">{t('roles.MANAGER')}</SelectItem>
                  <SelectItem value="admin">{t('roles.ADMIN')}</SelectItem>
                  <SelectItem value="banned">{t('roles.BANNED')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isCreatingUser}
            >
              {isCreatingUser ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('dialog.add.submit')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
