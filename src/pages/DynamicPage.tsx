
import { useEffect, useState } from "react";
import PageBlocks from "../PageBlocks";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const DynamicPage = ({ page }: { page: any }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data: Todo[] = await response.json();
        setTodos(data.slice(0, 10));
      } catch (err) {
        console.error("Error fetching todos:", err);
        setError("Unable to load todos. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <>
      {/* API-driven content */}
      <section className="my-6">
        <h2 className="text-2xl font-bold mb-4">
          Dynamic Todos
        </h2>

        {loading && <p>Loading todos...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium">
                    {todo.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Todo ID: {todo.id} | User ID: {todo.userId}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium ${todo.completed
                    ? "text-green-600"
                    : "text-orange-500"
                    }`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contentstack authorable modular blocks */}
      <PageBlocks page={page} />
    </>
  );
};

export default DynamicPage;
