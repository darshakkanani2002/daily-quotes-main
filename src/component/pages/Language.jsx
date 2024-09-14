import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Test_Api } from '../Config';
import { toast, ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../modal/DeleteModal';

export default function Language() {
    const [language, setLanguage] = useState([]);
    const [languageData, setLanguageData] = useState({
        vName: '',
    });
    const [deleteId, setDeleteId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    useEffect(() => {
        fetchData();
    }, [])

    // fetch Data list--------------------------------------------------------------------------------------

    const fetchData = () => {
        axios.get(`${Test_Api}language/details`).then(response => {
            console.log("Language Data ==>", response.data.data);
            setLanguage(response.data.data)
        }).catch(error => {
            console.log(error);
        })
    }

    // Data save Api-------------------------------------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdating) {
            const updateData = {
                vlanguageId: currentId,
                vName: languageData.vName
            };
            console.log("Updated Language Data ==> ", updateData)

            try {
                await axios.put(`${Test_Api}language/details`, updateData)
                    .then(response => {
                        console.log("Language Update Data ==>", response.data);
                        setLanguageData({
                            vName: '',
                        });
                        fetchData();
                    }).catch(error => {
                        console.log(error);
                    });
                toast.success('Language Updated successfully!');
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                await axios.post(`${Test_Api}language/details`, languageData).then(response => {
                    console.log("save Languages ==>", response.data);
                    fetchData();
                    setLanguageData({
                        vName: '',
                    })
                }).catch(error => {
                    console.log(error);

                })
                toast.success('Language created successfully!');
            } catch (error) {
                console.log(error);
            }
        }


    }
    // update data handle----------------------------------------------------------------------------------------
    const handleUpdate = (language) => {
        setLanguageData({
            vName: language.vName
        });
        setIsUpdating(true);
        setCurrentId(language._id);
    }
    // data delete api---------------------------------------------------------------------------------------------

    const handleDelete = () => {
        axios.delete(`${Test_Api}language/details`, {
            data: { vlanguageId: deleteId }
        }).then(response => {
            console.log("Language deleted successfully:", response.data);
            fetchData();
            toast.success(<i className="fa-solid fa-trash"></i>, 'Language deleted successfully!');
        }).catch(error => {
            console.log(error);

        })
    }

    return (
        <div>
            <div className='py-3'>
                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition:Bounce
                />
                <div className='side-container'>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-7">
                                <input type="text" value={languageData.vName} className='form-control py-2' placeholder='Language' onChange={(e) => setLanguageData({ ...languageData, vName: e.target.value })} />
                            </div>
                            <div >
                                <button type='submit' className='btn btn-success my-3'>
                                    {isUpdating ? 'Update Language' : 'Add Language'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className='side-container'>
                <div>
                    <table className='table text-center'>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Language</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {language.length > 0 ?
                                (language.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>{item.vName}</td>
                                        <td>
                                            <button className='btn btn-danger mx-2 px-3'
                                                onClick={() => setDeleteId(item._id)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                                title='Delete'>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button className='btn btn-success mx-2 px-3'
                                                onClick={() => handleUpdate(item)}
                                                title='Update'>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                    <tr className='text-center'>
                                        <td colSpan="3" className='py-3'>
                                            <img src="/images/ic-content.svg" alt="ic-content" className='img-fluid' />
                                            <span className='table-data-not-found-text mt-1 d-block'>Data Not Found !</span>
                                        </td>
                                    </tr>
                                )}

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal deleteID={deleteId} handleDelete={handleDelete}></DeleteModal>
        </div>
    )
}
