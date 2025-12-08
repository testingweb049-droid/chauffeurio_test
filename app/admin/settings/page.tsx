"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  updateAdminProfileSchema,
  type ChangePasswordInput,
  type UpdateAdminProfileInput,
} from "@/lib/validations/admin";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/component/ui/card";
import { SessionResponse, ApiResponse } from "@/types/admin";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [admin, setAdmin] = useState<{ id: string; email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileForm = useForm<UpdateAdminProfileInput>({
    resolver: zodResolver(updateAdminProfileSchema),
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch("/api/admin/session");
        const data: SessionResponse = await response.json();

        if (data.authenticated && data.admin) {
          setAdmin(data.admin);
          profileForm.reset({
            name: data.admin.name,
            email: data.admin.email,
          });
        }
      } catch (error) {
        console.error("Settings error:", error);
        toast.error("Failed to load admin information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, [profileForm]);

  const onProfileSubmit = async (data: UpdateAdminProfileInput) => {
    try {
      // Note: Profile update endpoint would need to be created
      toast.success("Profile update feature coming soon");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordInput) => {
    try {
      // Note: Password change endpoint would need to be created
      toast.success("Password change feature coming soon");
      passwordForm.reset();
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin profile and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                {...profileForm.register("name")}
                disabled={profileForm.formState.isSubmitting}
              />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...profileForm.register("email")}
                disabled={profileForm.formState.isSubmitting}
              />
              {profileForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
            >
              {profileForm.formState.isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current_password" className="text-sm font-medium">
                Current Password
              </label>
              <Input
                id="current_password"
                type="password"
                {...passwordForm.register("current_password")}
                disabled={passwordForm.formState.isSubmitting}
              />
              {passwordForm.formState.errors.current_password && (
                <p className="text-sm text-red-500">
                  {passwordForm.formState.errors.current_password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="new_password" className="text-sm font-medium">
                New Password
              </label>
              <Input
                id="new_password"
                type="password"
                {...passwordForm.register("new_password")}
                disabled={passwordForm.formState.isSubmitting}
              />
              {passwordForm.formState.errors.new_password && (
                <p className="text-sm text-red-500">
                  {passwordForm.formState.errors.new_password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm_password" className="text-sm font-medium">
                Confirm New Password
              </label>
              <Input
                id="confirm_password"
                type="password"
                {...passwordForm.register("confirm_password")}
                disabled={passwordForm.formState.isSubmitting}
              />
              {passwordForm.formState.errors.confirm_password && (
                <p className="text-sm text-red-500">
                  {passwordForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

