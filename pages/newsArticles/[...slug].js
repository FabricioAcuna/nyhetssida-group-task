import { useSavedArticles } from "@/context/SavedArticlesContext";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const category = slug[0];
  const articleID = slug[1];

  const response = await fetch(
    `https://newsdata.io/api/1/news?apikey=${process.env.DIN_API_KEY}&category=${category}&language=en`
  );
  const data = await response.json();

  const article =
    data.results.find((item) => item.article_id === articleID) || null;

  return {
    props: {
      article,
    },
  };
}

export default function SSRArticle({ article }) {
  const { saveArticle, removeArticle, savedArticles } = useSavedArticles();
  const defaultImg =
    "https://s.france24.com/media/display/e6279b3c-db08-11ee-b7f5-005056bf30b7/w:1280/p:16x9/news_en_1920x1080.jpg";

  if (!article) {
    return (
      <div>
        <p className="text-center text-xl font-semibold my-10">No article available</p>
        <button
          className="btn btn-primary ml-2 mb-2"
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
    );
  }

  const isSaved = savedArticles.some((a) => a.article_id === article.article_id);

  return (
    <div className="container bg-gray-100 mx-auto p-6 md:p-16 lg:p-16">
      <div className="card bg-white shadow-xl md:p-6 lg:p-6 border-y-2 border-red-500">
        <figure className="mt-auto">
          <img
            src={article.image_url || defaultImg}
            alt={article.title}
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </figure>
        <div className="card-body">
          <h1 className="text-xl md:text-3xl lg:text-3xl font-bold text-black">{article.title}</h1>
          <p className="text-lg text-gray-800 mt-4">
            {article.description}
          </p>
          <div className="mt-6 flex gap-4">
            <button
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              className={`btn ${isSaved ? "btn-error" : "btn-accent"}`}
              onClick={() =>
                isSaved ? removeArticle(article.article_id) : saveArticle(article)
              }
            >
              {isSaved ? "Remove bookmark" : "Bookmark"
              }
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
