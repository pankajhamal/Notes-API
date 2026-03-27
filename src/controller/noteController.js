import { prisma } from "../config/db.js";

const createNote = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(401).json({ err: "You must enter some notes" });
  }

  const note = await prisma.note.create({
    data: {
      title,
      description,
      createdById: req.user.id,
    },
  });

  return res.status(200).json({
    status: "Note created successfully",
    data: {
      note: {
        id: note.id,
        title: note.title,
        description: note.description,
        createdById: note.createdById,
      },
    },
  });
};

//Update note
const updateNote = async(req, res) =>{
  const {title, description} = req.body;

  const note = await prisma.note.findUnique({
    where: {id: req.params.id},
  });

  if(!note){
    return res.status(400).json({err: "Note doesn't exist"})
  }

  //Ensure only user can update
  if(note.createdById !== req.user.id){
    return res.status(400).json({err: "User not authorized to update"});
  }

  //Build updated data
  const updatedData = {};
  if(title !== undefined) updatedData.title = title;
  if(description !== undefined) updatedData.description = description;

  const updatedNote = await prisma.note.update({
    where: {id: req.params.id},
    data: updatedData,
  })

  res.status(200).json({
    status: "Successful",
    data: updatedNote,
  })
}

const deleteNote = async (req, res) =>{
  console.log("Delete")
  const note = await prisma.note.findUnique({
    where: {id: req.params.id},
  })

  if(!note) {
    return res.status(400).json({err: "Note doesn't exist"});
  }
  //Ensure only user can delete note
  if(note.createdById !== req.user.id){
    return res.status(400).json({err: "User not authorized to delete the note"});
  }

  await prisma.note.delete({
    where: {id: req.params.id},
  })

   res.status(200).json({
    status: "Success",
    message: "Note deleted successfully",
  })

}

const readNote = async (req, res) =>{

   const allNotes = await prisma.note.findMany();

  const notes = {};
  for(let note in allNotes){
    if(note.createdById === req.user.id){
      notes.push(note);
    } else {
      return res.status(400).json({err: "No notes created by user"});
    }
  }

  res.status(200).json({
    status: "success",
    data: notes,
  })

}

export { createNote, updateNote, deleteNote, readNote };
