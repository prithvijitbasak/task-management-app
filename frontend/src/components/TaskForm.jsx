import React, { useState, useEffect } from "react";

const TaskForm = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.selectedTask === null) {
      props.addTask({ title, description, dueDate, status });
    } else {
      props.updateTask({title: title, description: description, dueDate: dueDate, status: status });
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setStatus("");
  };

  const handleXButtonClick = () => {
    clearForm();
    props.visibility();
  };

  useEffect(() => {
    if(props.selectedTask) {
      setTitle(props.selectedTask.title);
      setDescription(props.selectedTask.description);
      setDueDate(props.selectedTask.dueDate);
      setStatus(props.selectedTask.status);
    } else {
      clearForm();
    }
  }, [props.selectedTask]);

  return (
    <>
      <div className="flex items-center justify-between" id="formOverlay">
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-md border border-gray-300">
            <div className="flex justify-end pe-2">
              <button
                className="bg-red-500 py-2 px-4 ms-10 my-2 rounded-full text-white text-xl font-semibold transition hover:bg-red-700 active:scale-95"
                id="closeFormButton"
                onClick={handleXButtonClick}
              >
                X
              </button>
            </div>
            <form
              action=""
              className="max-w-md mx-3 my-3"
              id="myForm"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  for="title"
                >
                  Title
                </label>
                <input
                  className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="title"
                  title="Title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  for="title"
                >
                  Description
                </label>
                <input
                  className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  required
                  id="description"
                  title="Description"
                  placeholder="Description of the task...."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  for="title"
                >
                  Due Date
                </label>
                <input
                  className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  required
                  id="dueDate"
                  title="Due Date"
                  placeholder="15/12/2023"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  for="title"
                >
                  Status
                </label>
                <input
                  className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="status"
                  required
                  id="status"
                  title="Status"
                  placeholder="Pending/Completed"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 hover:scale-105 active:scale-95 transition duration-200 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:outline-shadow"
                  type="submit"
                  value="submit"
                >
                  {props.selectedTask !== null ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
