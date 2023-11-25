import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import axios from "axios";
import AddingConfirmationBox from "./components/AddingConfirmationBox";
import UpdationConfirmationBox from "./components/UpdationConfirmationBox";
import DeleteConfirmation from "./components/DeleteConfirmation";
import DeletionConfirmationBox from "./components/DeletionConfirmationBox";

const App = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formKey, setFormKey] = useState();
  const [addingComponentVisibility, setAddingComponentVisibility] =
    useState(false);
  const [deleteConfirmationVisibility, setDeleteConfirmationVisibility] =
    useState(false);
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState(null);
  const [confirmUpdation, setConfirmUpdation] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleVisibility = () => {
    setShowForm(!showForm);
    setFormKey(formKey + 1);
  };

  const handleTaskClick = () => {
    setSelectedTask(null);
    toggleVisibility();
  };

  const addTask = (taskData) => {
    setData([...data, taskData]);
    axios
      .post("http://localhost:5000/api/data", taskData)
      .then(() => {
        // fetchData();
        // setShowForm(false);
        toggleVisibility();
        setAddingComponentVisibility(true);
        setTimeout(() => {
          setAddingComponentVisibility(false);
        }, 3000);
      })

      .catch((error) => {
        console.error("Error adding data: ", error);
      });
  };

  const handleEdit = (index) => {
    setSelectedTask(data[index]);
    toggleVisibility();
  };

  const updateTask = (updatedTask) => {
    const selectedIndex = data.indexOf(selectedTask);
    if (selectedIndex !== -1) {
      const updatedTasks = [...data];
      updatedTasks[selectedIndex].key = data[selectedIndex].key;
      updatedTasks[selectedIndex].title = updatedTask.title;
      updatedTasks[selectedIndex].description = updatedTask.description;
      updatedTasks[selectedIndex].dueDate = updatedTask.dueDate;
      updatedTasks[selectedIndex].status = updatedTask.status;
      // console.log(selectedIndex);
      // console.log(updatedTasks[selectedIndex].key);
      // console.log(updatedTasks[selectedIndex].title);
      // console.log(updatedTasks[selectedIndex].dueDate);
      // console.log(updatedTasks[selectedIndex].description);
      // console.log(updatedTasks[selectedIndex].status);
      axios
        .put("http://localhost:5000/api/update", {
          updatedData: updatedTasks,
          editIndex: selectedIndex,
          key: data[selectedIndex].key,
        })
        .then(() => {
          setShowForm(false);
          setConfirmUpdation(true);
          setTimeout(() => {
            setConfirmUpdation(false);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error updating data: ", error);
        });
    } else {
      console.error("Selected Task not found in data.");
    }
    toggleVisibility();
  };


  const handleDelete = () => {
    axios
      .post(`http://localhost:5000/api/delete`, {
        index: deleteConfirmationIndex
      })
      .then(() => {
        fetchData();
        setDeleteConfirmationVisibility(false);
        setConfirmDeletion(true);
        setTimeout(() => {
          setConfirmDeletion(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting data: ", error);
      });
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {showForm && (
        <TaskForm
          key={formKey}
          visibility={toggleVisibility}
          addTask={addTask}
          selectedTask={selectedTask}
          updateTask={updateTask}
        />
      )}
      {addingComponentVisibility && <AddingConfirmationBox />}
      {confirmUpdation && <UpdationConfirmationBox />}
      {deleteConfirmationVisibility && (
        <DeleteConfirmation
          deleteRow={handleDelete}
          cancelDeletion={() => {
            setDeleteConfirmationVisibility(false);
          }}
        />
      )}
      {confirmDeletion && <DeletionConfirmationBox />}
      <div className="mx-auto px-4 py-8">
        <div className="flex items-center justify-between py-2">
          <h1 className="text-xl font-bold mb-2">
            Task Management Application
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white py-2 px-4 my-2 rounded-md flex items-center transition duration-200 active:scale-95"
            onClick={handleTaskClick}
          >
            <span className="mr-1">+</span>Add Task
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-200 border-b-2 border-gray-200">
                <tr>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Task ID
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Title
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Description
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Due Date
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Status
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Update
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody id="tableBody">
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center px-4 py-2 border border-b-0 border-r-1 border-black border-opacity-20">
                      {item.key}
                    </td>
                    <td className="text-center px-4 py-2 border border-b-0 border-r-1 border-black border-opacity-20">
                      {item.title}
                    </td>
                    <td className="text-center px-4 py-2 border border-b-0 border-r-1 border-black border-opacity-20">
                      {item.description}
                    </td>
                    <td className="text-center px-4 py-2 border border-b-0 border-r-1 border-black border-opacity-20">
                      {item.dueDate}
                    </td>
                    <td className="text-center px-4 py-2 border border-b-0 border-r-1 border-black border-opacity-20">
                      {item.status}
                    </td>
                    <td className="text-center px-4 py-2 border border-b-0 border-r-1 border-black border-opacity-20">
                      <button
                        className="rounded bg-green-500 px-3 transition duration-300 hover:scale-110 active:scale-90 uppercase"
                        onClick={() => {
                          handleEdit(index)
                          console.log(index);
                          }}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="text-center px-4 py-2 border border-b-0 border-r-1 border-black border-opacity-30">
                      <button
                        className="rounded bg-red-500 px-3 transition duration-300 hover:scale-110 active:scale-90 uppercase"
                        onClick={() => {
                          // console.log(index);
                          setDeleteConfirmationVisibility(true);
                          setDeleteConfirmationIndex(index);
                          console.log(deleteConfirmationIndex);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
