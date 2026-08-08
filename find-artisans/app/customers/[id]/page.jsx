import CustomerProfilePage from "./customerspage";

async function getCustomer(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) return null;

  const result = await res.json();

  const data =
    result.user ||
    result.data ||
    result;

  return {
    customer: data.user,
    stats: data.stats || {},
    jobs: data.jobs || [],
  };
}

export default async function Page({ params }) {
  const { id } = await params;

  const data = await getCustomer(id);

  if (!data) {
    return <div>Customer not found</div>;
  }

  return (
    <CustomerProfilePage
      customer={data.customer}
      stats={data.stats}
      jobs={data.jobs}
      id={id}
    />
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    return {
      title: "Customer | FindArtisans",
    };
  }

  const result = await res.json();

  const data =
    result.user ||
    result.data ||
    result;

  const customer = data.user;

  return {
    title: `${customer.fullName} | Customer | FindArtisans`,

    description: `View ${customer.fullName}'s public customer profile on FindArtisans.`,

    alternates: {
      canonical: `https://find-artisans.com/customers/${id}`,
    },

    openGraph: {
      title: `${customer.fullName} | FindArtisans`,
      description: `Public customer profile.`,
      url: `https://find-artisans.com/customers/${id}`,
      images: [
        {
          url:
            customer.profilePhoto ||
            "/images/default-customer.jpg",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: customer.fullName,
      description: "Public customer profile",
      images: [
        customer.profilePhoto ||
          "/images/default-customer.jpg",
      ],
    },
  };
}