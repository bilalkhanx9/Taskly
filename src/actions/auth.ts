"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: z.infer<typeof RegisterSchema>) {
  try {
    const validated = RegisterSchema.parse(formData);
    const normalizedEmail = validated.email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return { success: false, error: "An account with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user and initial workspace
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "ADMIN",
        workspaces: {
          create: {
            name: `${validated.name}'s Workspace`,
            slug: `${validated.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            projects: {
              create: {
                name: "Sample Project",
                description: "A sample project to help you explore tasks, boards, and team collaboration.",
                bannerColor: "#2563EB",
                isFavorite: false,
              },
            },
          },
        },
      },
      include: {
        workspaces: {
          include: {
            projects: true,
          },
        },
      },
    });

    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error?.errors?.[0]?.message || error.message || "Failed to create account",
    };
  }
}

/**
 * Ensures the default Admin user (Bilal Khan) and initial workspace exist
 */
export async function seedInitialAdmin() {
  try {
    const adminEmail = "bilalrauf.ds@gmail.com";
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existing) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await prisma.user.create({
        data: {
          name: "Bilal Khan",
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
          workspaces: {
            create: {
              name: "Sample Workspace",
              slug: "sample-workspace",
              projects: {
                create: {
                  name: "Sample Project",
                  description: "A sample project to help you explore tasks, boards, and team collaboration.",
                  bannerColor: "#2563EB",
                  isFavorite: false,
                },
              },
            },
          },
        },
      });
      console.log("Admin Bilal Khan successfully initialized in database.");
    }
  } catch (error) {
    console.error("Failed to seed initial admin:", error);
  }
}
