'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface User {
  id: number
  email: string 
  role: 'USER' | 'ADMIN'
}

export default function AdminDashboard() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    email: '',
    role: 'USER'
  })

  // Dummy data for initial layout
  const users: User[] = [
    { id: 1, email: 'user1@example.com', role: 'USER' },
    { id: 2, email: 'admin@example.com', role: 'ADMIN' },
    { id: 3, email: 'user2@example.com', role: 'USER' },
  ]

  const handleEmailChange = (email: string) => {
    setNewUser(prev => ({ ...prev, email }))
  }

  const handleRoleChange = (role: User['role']) => {
    setNewUser(prev => ({ ...prev, role }))
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsAddUserOpen(true)}>Add New User</Button>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select defaultValue={user.role} onValueChange={(value: User['role']) => {}}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Save Changes
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
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select 
                defaultValue={newUser.role}
                onValueChange={(value: User['role']) => handleRoleChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Add User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}