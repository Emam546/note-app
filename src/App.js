import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
// import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";
const DataUsed = localStorage.getItem("notes");
const oldNotes=DataUsed? JSON.parse(DataUsed):[];
const oldCurrentNodeId=localStorage.getItem("currentId");
export default function App() {
    const [notes, setNotes] = React.useState(oldNotes);
    const [currentNoteId, setCurrentNoteId] = React.useState(
        oldCurrentNodeId ||((notes[0] && notes[0].id) || "")
    );
    React.useEffect(()=>{
        localStorage.setItem("currentId",currentNoteId)
    },[currentNoteId])
    React.useEffect(()=>{
        localStorage.setItem("notes",JSON.stringify(notes))
    },[notes])
    function createNewNote() {
        let name = prompt("What is the name of the note ? ");
        if (!name) return;

        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here",
            name,
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }
    function deleteCurrentNode(){
        setNotes((oldNotes)=>{
            const newNotes=oldNotes.filter((note)=>note.id!==currentNoteId);
            if(newNotes[0])
                setCurrentNoteId(newNotes[0].id)
            else
                setCurrentNoteId("")
            return newNotes
        })
    }

    function updateNote(text) {
        setNotes((oldNotes) => {
            let newNote=oldNotes.map((oldNote)=>currentNoteId===oldNote.id?{...oldNote,body:text}:oldNote)
            newNote=newNote.sort((a,b)=>a.id===currentNoteId?-1:0)
            return newNote
        }
        );
    }

    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId;
            }) || notes[0]
        );
    }
    function setNewName(id,text){
        console.log(id);
        setNotes(
            (oldNotes)=>oldNotes.map(
                (oldNote)=>oldNote.id===id?{...oldNote,name:text}:oldNote
                )
            )
    }

    return (
        <main>
            {notes.length > 0 ? (
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={notes}
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNode={deleteCurrentNode}
                        setNewName={setNewName}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor
                            currentNote={findCurrentNote()}
                            updateNote={updateNote}
                        />
                    )}
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
