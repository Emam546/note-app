import React from "react";
class NodeElement extends React.Component {
    constructor(props) {
        super(props);
        // React.createRef()
        // .addEventListener('click', NodeElement.makeDoubleClick(), false);;
    }
    makeDoubleClick(doubleClickCallback, singleClickCallback) {
        var clicks = 0, timeout;

        return ()=> {
            clicks++;
            if (clicks === 1) {
                singleClickCallback && singleClickCallback.apply(this, arguments);
                this.props.setCurrentNoteId(this.props.note.id)
                timeout = setTimeout(function() { clicks = 0; }, 400);
            } else {
                timeout && clearTimeout(timeout);
                this.newName()
                doubleClickCallback && doubleClickCallback.apply(this, arguments);
                clicks = 0;
            }
        };
    }
    newName(){
        const { note:{name,id},setNewName}=this.props
        let newname = prompt("What is the name of the note ? ",name);
        if(!newname || newname===name)return
        setNewName(id,newname)
    }
    
    render() {
        const { note, activate } = this.props;
        return (
            <div>
                <div
                    className={`title ${
                        activate? "selected-note" : ""
                    }`}
                    onClick={this.makeDoubleClick()}
                >
                    <h4 className="text-snippet">{note.name}</h4>
                </div>
            </div>
        );
    }
}
export default function Sidebar({
    notes,
    setCurrentNoteId,
    currentNote,
    newNote,
    deleteNode,
    setNewName
}) {
    const noteElements = notes.map(
        (note) => 
            <NodeElement 
                key={note.id}
                setCurrentNoteId={setCurrentNoteId}
                note={note}
                activate={note.id === currentNote.id}
                setNewName={setNewName}
                />
        );

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={newNote}>
                    +
                </button>
                <button className="new-note" onClick={deleteNode}>
                    -
                </button>
            </div>
            {noteElements}
        </section>
    );
}
