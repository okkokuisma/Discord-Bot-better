import React, { useState } from "react";
import courseService from "../services/courseService";

const CreateCourseForm = () => {
  const [nickname, setNickname] = useState('')
  const [fullName, setFullName] = useState('')
  const [courseCode, setCourseCode] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()

    await courseService.createCourse({
      name: nickname,
      fullName: fullName,
      courseCode: courseCode
    })
    setNickname('')
    setFullName('')
    setCourseCode('')
  }

  return <div style={{float: 'unset'}}>
    <h2>Add a new course</h2>
    <form onSubmit = {handleCreate}>
      <p>Nick name <input type="text" value={nickname} id="title" name="Title" onChange={({ target }) => setNickname(target.value)}/></p>
      <p>Full name <input type="text" value={fullName} id="author" name="Author" onChange={({ target }) => setFullName(target.value)}/></p>
      <p>Course code <input type="text" value={courseCode} id="url" name="Url" onChange={({ target }) => setCourseCode(target.value)}/></p>
      <button type="submit">Create</button>
    </form>
  </div>
};

export default CreateCourseForm;