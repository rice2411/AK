import { Task } from '../types';

// Helper to generate specific dates
const getDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString();
};

// Helper to get date in specific month of current year (for yearly chart data)
const getMonthDate = (monthIndex: number, day: number = 15) => {
  const d = new Date();
  d.setMonth(monthIndex);
  d.setDate(day);
  return d.toISOString();
};

export const fetchMockTasks = async (): Promise<Task[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const userPhuc = {
    username: "PhucLH",
    full_name_display: "PhucLH",
    photo: "https://ui-avatars.com/api/?name=Phuc+LH&background=0D8ABC&color=fff", 
    big_photo: null,
    gravatar_id: "",
    is_active: true,
    id: 185
  };

  const userQuang = {
      username: "QuangND3",
      full_name_display: "QuangND3",
      photo: "https://ui-avatars.com/api/?name=Quang+ND&background=e11d48&color=fff",
      big_photo: null,
      gravatar_id: "",
      is_active: true,
      id: 202
  };

  const userAlex = {
      username: "AlexDev",
      full_name_display: "Alex Johnson",
      photo: "https://ui-avatars.com/api/?name=Alex+J&background=10b981&color=fff",
      big_photo: null,
      gravatar_id: "",
      is_active: true,
      id: 305
  };

  const ownerUser = {
      username: "Admin",
      full_name_display: "Admin",
      photo: null,
      big_photo: null,
      gravatar_id: "",
      is_active: true,
      id: 5
  };

  const projectInfo = {
    name: "TaskManagement",
    slug: "taskmanagement",
    logo_small_url: null,
    id: 7
  };

  const tasks: Task[] = [
    // --- Recent Tasks (Current Month) ---
    {
      id: 14879, subject: "Fix layout collapse on mobile", status: 41,
      status_extra_info: { name: "In Coming", color: "#60a5fa", is_closed: false },
      assigned_to: 185, assigned_to_extra_info: userPhuc, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getDate(1), modified_date: getDate(0),
      is_closed: false, is_blocked: false, due_date: null, total_comments: 0
    },
    {
      id: 14880, subject: "Implement Dark Mode", status: 42,
      status_extra_info: { name: "In Progress", color: "#f59e0b", is_closed: false },
      assigned_to: 185, assigned_to_extra_info: userPhuc, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getDate(2), modified_date: getDate(1),
      is_closed: false, is_blocked: false, due_date: null, total_comments: 3
    },
    {
      id: 14885, subject: "Database migration script", status: 45,
      status_extra_info: { name: "Pending", color: "#ef4444", is_closed: false },
      assigned_to: 305, assigned_to_extra_info: userAlex, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getDate(3), modified_date: getDate(2),
      is_closed: false, is_blocked: true, due_date: null, total_comments: 1
    },
    {
      id: 14881, subject: "API Connection Timeout Fix", status: 43,
      status_extra_info: { name: "MR", color: "#a855f7", is_closed: false },
      assigned_to: 202, assigned_to_extra_info: userQuang, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getDate(5), modified_date: getDate(2),
      is_closed: false, is_blocked: false, due_date: null, total_comments: 5
    },
    // --- Last Month Tasks ---
    {
      id: 14882, subject: "Update User Avatar Component", status: 44,
      status_extra_info: { name: "DONE", color: "#22c55e", is_closed: true },
      assigned_to: 185, assigned_to_extra_info: userPhuc, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getDate(25), modified_date: getDate(5),
      is_closed: true, is_blocked: false, due_date: null, total_comments: 1
    },
    {
      id: 14883, subject: "Refactor Auth Logic", status: 44,
      status_extra_info: { name: "DONE", color: "#22c55e", is_closed: true },
      assigned_to: 202, assigned_to_extra_info: userQuang, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getDate(28), modified_date: getDate(2),
      is_closed: true, is_blocked: false, due_date: null, total_comments: 0
    },
    // --- Historical Data for Yearly Chart ---
    // Generate some random tasks for previous months
    ...Array.from({ length: 5 }).map((_, i) => ({
      id: 20000 + i, subject: `Old Task Jan ${i}`, status: 44,
      status_extra_info: { name: "DONE", color: "#22c55e", is_closed: true },
      assigned_to: 185, assigned_to_extra_info: userPhuc, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getMonthDate(0, i + 1), modified_date: getMonthDate(0, i + 1),
      is_closed: true, is_blocked: false, due_date: null, total_comments: 0
    })),
    ...Array.from({ length: 8 }).map((_, i) => ({
      id: 21000 + i, subject: `Old Task Mar ${i}`, status: 44,
      status_extra_info: { name: "DONE", color: "#22c55e", is_closed: true },
      assigned_to: 202, assigned_to_extra_info: userQuang, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getMonthDate(2, i + 1), modified_date: getMonthDate(2, i + 1),
      is_closed: true, is_blocked: false, due_date: null, total_comments: 0
    })),
    ...Array.from({ length: 4 }).map((_, i) => ({
      id: 22000 + i, subject: `Old Task Jun ${i}`, status: 44,
      status_extra_info: { name: "DONE", color: "#22c55e", is_closed: true },
      assigned_to: 305, assigned_to_extra_info: userAlex, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getMonthDate(5, i + 1), modified_date: getMonthDate(5, i + 1),
      is_closed: true, is_blocked: false, due_date: null, total_comments: 0
    })),
    ...Array.from({ length: 12 }).map((_, i) => ({
      id: 23000 + i, subject: `Old Task Aug ${i}`, status: 44,
      status_extra_info: { name: "DONE", color: "#22c55e", is_closed: true },
      assigned_to: 185, assigned_to_extra_info: userPhuc, owner: 5, owner_extra_info: ownerUser,
      project: 7, project_extra_info: projectInfo, tags: [], created_date: getMonthDate(7, i + 1), modified_date: getMonthDate(7, i + 1),
      is_closed: true, is_blocked: false, due_date: null, total_comments: 0
    })),
  ];

  return tasks;
};
