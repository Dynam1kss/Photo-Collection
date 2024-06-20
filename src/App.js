import React from "react";
import { Collection } from "./Collection";
import "./index.scss";

const allCategories = [
  { name: "All" },
  { name: "Sea" },
  { name: "Mountains" },
  { name: "Architecture" },
  { name: "Cities" },
];

function App() {
  const [categoryId, setCategoryId] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");
  const [collections, setCollections] = React.useState([]);

  React.useEffect(() => {
    setIsLoading(true);

    // adding category=id to the link at the end, to sort the
    // data from backend by selected categories
    const category = categoryId ? `category=${categoryId}` : "";

    fetch(
      `https://6645b419b8925626f892c883.mockapi.io/project6/photo_collections?page=${page}&limit=3&${category}`
    )
      .then((res) => res.json())
      .then((json) => {
        const filteredCollections = json.filter(
          (item) => item.category && item.photos && item.photos.length >= 4
        );
        setCollections(filteredCollections);
      })
      .catch((err) => {
        console.warn(err);
        alert("Error while fetching data");
      })
      .finally(() => setIsLoading(false));
  }, [categoryId, page]);

  return (
    <div className='App'>
      <h1>My photo collection</h1>
      <div className='top'>
        <ul className='tags'>
          {allCategories.map((obj, i) => (
            <li
              onClick={() => setCategoryId(i)}
              className={categoryId === i ? "active" : ""}
              key={obj.name}
            >
              {obj.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='search-input'
          placeholder='Search by name'
        />
      </div>
      <div className='content'>
        {isLoading ? (
          <h2>Loading content ...</h2>
        ) : collections.length > 0 ? (
          collections
            .filter((obj) =>
              obj.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((obj, index) => (
              <Collection key={index} name={obj.name} images={obj.photos} />
            ))
        ) : (
          <h3>No collections found :c</h3>
        )}
      </div>
      <ul className='pagination'>
        {
          // a plug, since the backend does not transmit
          // the number of pages (mockapi itself)
          [...Array(5)].map((_, i) => (
            <li
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default App;
