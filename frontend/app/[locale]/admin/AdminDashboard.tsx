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

interface User {
  id: number;
  email: string;
  role: "HR" | "MANAGER" | "ADMIN";
}

export default function AdminDashboard() {
  const t = useTranslations('admin.users');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    email: "",
    role: "HR",
  });

  // Dummy data for initial layout
  const users: User[] = [
    { id: 1, email: "user1@example.com", role: "HR" },
    { id: 2, email: "admin@example.com", role: "ADMIN" },
    { id: 3, email: "user2@example.com", role: "HR" },
  ];

  const handleEmailChange = (email: string) => {
    setNewUser((prev) => ({ ...prev, email }));
  };

  const handleRoleChange = (role: User["role"]) => {
    setNewUser((prev) => ({ ...prev, role }));
  };

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
              <TableHead>{t('role')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select defaultValue={user.role}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">{t('roles.HR')}</SelectItem>
                      <SelectItem value="MANAGER">{t('roles.MANAGER')}</SelectItem>
                      <SelectItem value="ADMIN">{t('roles.ADMIN')}</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    {t('dialog.edit.saveChanges')}
                  </Button>
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
              <label className="text-sm font-medium">{t('dialog.add.roleLabel')}</label>
              <Select
                defaultValue={newUser.role}
                onValueChange={(value: User["role"]) => handleRoleChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">{t('roles.HR')}</SelectItem>
                  <SelectItem value="MANAGER">{t('roles.MANAGER')}</SelectItem>
                  <SelectItem value="ADMIN">{t('roles.ADMIN')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">{t('dialog.add.submit')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
