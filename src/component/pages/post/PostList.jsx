import React from 'react'
import { Img_Url } from '../../Config'

export default function PostList({ post, currentPosts, setDeleteId, handleUpdate }) {
    return (
        <div>
            <div className='side-container mt-5'>
                <div className='table-responsive'>
                    <table className='table text-center'>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Images</th>
                                <th>Start Color</th>
                                <th>End Color</th>
                                <th>Text Color</th>
                                {/* <th>Language Code</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(post) && post.length > 0 ? (
                                currentPosts.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>
                                            <img crossOrigin="anonymous" src={`${Img_Url}${item.vImages}`} alt="images" style={{ width: '60px', height: 'auto' }} />
                                        </td>
                                        <td>
                                            <div className='post-hex-color'>{item.vStartColor}</div>
                                            <input type="color" value={item.vStartColor.slice(0, 7)} name="startcolor" id="startcolor" readOnly />
                                        </td> {/* Ensure color is displayed */}
                                        <td>
                                            <div className='post-hex-color'>{item.vEndColor}</div>
                                            <input type="color" value={(item.vEndColor.slice(0, 7))} name="endcolor" id="endcolor" readOnly />
                                        </td> {/* Ensure color is displayed */}
                                        <td>
                                            <div className='post-hex-color'>{item.vTextColor}</div>
                                            <input type="color" value={item.vTextColor} name="textcolor" id="endcolor" readOnly />
                                        </td> {/* Ensure color is displayed */}
                                        <td>
                                            <button className='btn btn-danger mx-2' title='Delete' onClick={() => setDeleteId(item._id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button className='btn btn-success mx-2 d-none' title='Update' onClick={() => handleUpdate(item)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className='text-center'>
                                    <td colSpan="7" className='p-2'>
                                        <div className='data-not-found-bg'>
                                            <img src="/images/question.png" alt="question" className='img-fluid' />
                                            <span className='table-data-not-found-text mt-1 d-block'>Data Not Found !</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
