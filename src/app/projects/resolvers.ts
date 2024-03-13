
import crypto from "crypto";
import { prismaClient } from "../clients/db";
import { Project } from "@prisma/client";
const queries = {
    getProject: async (_: any, { id }: { id: string }, context: any = {}) => {
        if (!context || !context.user) throw new Error("you are not authorized");
        const project = await prismaClient.project.findUnique({ where: { id } })
        if (!project) throw new Error("Project not found")
        return {
            data: project,
            success: true,
            message: "Project found"
        }
    },
    projects: async (_: any, { }, context: any = {}) => {
        if (!context || !context.user) return;
        const projects = await prismaClient.project.findMany()
        if (!projects) throw new Error("Projects not found")
        return {
            results: projects,
            success: true,
            message: "Projects found"
        }
    }
}
const mutations = {

    createProject: async (_: any, { title, description, screenshots, link, icon, github }: {
        title: string, description: string, screenshots: string[] | undefined, link: string | undefined, icon: string | undefined, github: string | undefined
    }, context: any = {}) => {
        if (!context || !context.user) throw new Error("you are not authorized");
        const url = crypto.randomBytes(4).toString('hex');
        const user = await prismaClient.user.findUnique({ where: { id: context.user.id } })
        if (!user) throw new Error("user not found")
        const newProject = {
            title,
            description,
            screenshots: screenshots || [],
            authorId: user.id,
            link,
            icon,
            github,
            upvote_count: 0,
            downvote_count: 0,
            url
        }

        const createdProject = await prismaClient.project.create({
            data: newProject
        })
        return {
            data: createdProject,
            success: true,
            message: "Project created successfully"
        }
    },
    deleteProject: async (_: any, { id }: { id: string }, context: any = {}) => {
        if (!context || !context.user) throw new Error("you are not authorized");
        const project = await prismaClient.project.findUnique({ where: { id } })
        if (project?.authorId !== context.user.id) throw new Error("You are not authorized to delete this project")
        const deletedProject = await prismaClient.project.delete({ where: { id } })
        return {
            success: true,
            message: "Project deleted successfully"
        }
    },
    updateProject: async (_: any, { id, title, description, screenshots, link, icon, github }: {
        id: string, title: string, description: string, screenshots: string[] | undefined, link: string | undefined, icon: string | undefined, github: string | undefined
    }, context: any = {}) => {
        if (!context || !context.user) throw new Error("you are not authorized");
        const project = await prismaClient.project.findUnique({ where: { id } })
        if (project?.authorId !== context.user.id) throw new Error("You are not authorized to update this project")
        const updatedProject = await prismaClient.project.update({
            where: { id },
            data: {
                title,
                description,
                screenshots: screenshots || [],
                link,
                icon,
                github
            }
        })
        return {
            data: updatedProject,
            success: true,
            message: "Project updated successfully"
        }
    }
}

const extraResolvers = {
    Project: {
        author: (parent: Project) => {
            const user = prismaClient.user.findUnique({ where: { id: parent.authorId } })
            return user
        }
    }
}

export const resolvers = { queries, mutations,extraResolvers }