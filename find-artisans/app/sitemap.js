
const BASE_URL = "https://find-artisans.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export default async function sitemap() {
  // Fetch workers
  const workersData = await fetchData("/users/workers/all");

  // Fetch all jobs
  const jobsData = await fetchData("/jobs");

  // Static public pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/workers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Worker profile URLs
  const workerPages =
    workersData?.workers?.map((worker) => ({
      url: `${BASE_URL}/workers/${worker._id}`,
      lastModified: worker.updatedAt
        ? new Date(worker.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })) || [];

  // Job detail URLs
  const jobPages =
    jobsData?.jobs?.map((job) => ({
      url: `${BASE_URL}/jobs/${job._id}`,
      lastModified: job.updatedAt
        ? new Date(job.updatedAt)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    })) || [];

  return [
    ...staticPages,
    ...workerPages,
    ...jobPages,
  ];
}
