import "./styles.css";
import { useEffect, useState, useRef, useMemo } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [edit, setEdit] = useState({
    enabled: false,
    task: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("@cursoReact");
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas));
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("@cursoReact", JSON.stringify(tasks));
  }, [tasks]);

  function handleRegister() {
    if (!input) {
      alert("Adicione uma tarefa!");
      return;
    }
    if (edit.enabled) {
      handleSaveEdit();
      return;
    }
    setTasks((tarefas) => [...tarefas, input]);
    setInput("");
  }

  function handleSaveEdit() {
    const findIndexTask = tasks.findIndex((task) => task === edit.task);
    const allTasks = [...tasks];
    allTasks[findIndexTask] = input;
    setTasks(allTasks);
    setEdit({
      enabled: false,
      task: "",
    });
    setInput("");
  }

  function handleDelete(item: string) {
    const removeTask = tasks.filter((task) => task !== item);
    setTasks(removeTask);
  }

  function handleEdit(item: string) {
    inputRef.current?.focus();
    setInput(item);
    setEdit({
      enabled: true,
      task: item,
    });
  }
  /*useMemo evita recálculo desnecessário.
  Aqui, ele guarda tasks.length em totalTarefas.
  Só atualiza totalTarefas quando tasks muda. */
  const totalTarefas = useMemo(() => {
    return tasks.length;
  }, [tasks]);

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <input
        placeholder="Digite o nome da tarefa..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        ref={inputRef}
      />
      <button onClick={handleRegister}>
        {edit.enabled ? "Atualizar Tarefa" : "Adicionar Tarefa"}{" "}
      </button>
      <hr />
      {/*Exibe a quantidade de tarefas da lista*/}
      <strong>Você tem {totalTarefas} tarefas!</strong>
      <br />
      <br />

      {tasks.map((item, index) => (
        <section key={item}>
          <span>{item}</span>
          <button onClick={() => handleEdit(item)}>Editar</button>
          <button onClick={() => handleDelete(item)}>Excluir</button>
        </section>
      ))}
    </div>
  );
}
