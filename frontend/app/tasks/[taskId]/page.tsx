"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function TaskDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${params.taskId}/`);
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
        router.push("/tasks");
      } finally {
        setLoading(false);
      }
    };

    if (params.taskId) {
      fetchTask();
    }
  }, [token, params.taskId, router]);

  const toggleStatus = async () => {
    if (!task) return;

    try {
      const newStatus = task.status === "todo" ? "done" : "todo";
      const response = await api.patch(`/tasks/${task.id}/`, {
        status: newStatus,
      });
      setTask(response.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async () => {
    if (!task || !confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${task.id}/`);
      router.push("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!token) return null;
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading task...</div>
      </div>
    );
  if (!task)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Task not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === "done"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status === "done" ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => router.push("/tasks")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Tasks
                </button>
                <button
                  onClick={toggleStatus}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    task.status === "todo"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  Mark as {task.status === "todo" ? "Complete" : "Pending"}
                </button>
                <button
                  onClick={deleteTask}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(task.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(task.updated_at).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
