import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";



export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const posts = [{
    _createdAt: new Date(),
    views: 55,
    author: { _id: 1, name: 'Makima' },
    _id: 1,
    description: 'This is description',
    image: 'https://images5.alphacoders.com/133/thumb-350-1336098.webp',
    category: "Robots",
    title: "We Robots"
  }]

  return (
    <>
      <section className="pink_container">
        <h1 className="heading !bg-transparent rounded-2xl">
          Pitch your startup, <br /> Connect with enterpreneur
        </h1>

        <p className="sub-heading !max-w-3xl">
          submit ideas, vote on pitches, and get noticed in virtual competitions
        </p>

        <SearchForm query={query} />

      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search result form "${query}"` : `All startups`}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType) => (
              <StartupCard key={post?._id} post={post}/>
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
        
      </section>

    </>
  );
}
