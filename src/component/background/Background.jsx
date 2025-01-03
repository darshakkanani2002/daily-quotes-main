import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Img_Url, Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Background() {
    const [background, setBackground] = useState([]);
    const [backgroundData, setBackgroundData] = useState({
        vImage: '',
    })
    const [preview, setPreview] = useState(null);
    const [deleteID, setDeleteId] = useState(null);
    const fileInputRef = useRef(null); // Ref for the file input
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        axios.post(`${Test_Api}background/list`).then(response => {
            console.log("Background List Data ==>", response.data.data);
            setBackground(response.data.data);
        }).catch(error => {
            console.log(error);

        })
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackgroundData({ ...backgroundData, vImage: file });
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('vimage', backgroundData.vImage);
        try {
            const response = await axios.post(`${Test_Api}background/details`, { vImages: backgroundData.vImage }, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log("Background Iamges uploaded successfully:", response.data);
            toast.success("Background Iamges uploaded successfully!");
            fetchData();
            setPreview(null);
            setBackgroundData({ vImage: '' });

            // Reset the file input field
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Error uploading Background Iamges:", error);
            toast.error("Error uploading Background Iamges.");
        }
    }

    const handleDelete = () => {
        if (!deleteID) {
            console.error("No delete ID selected");
            toast.error("No Background Iamges for deletion.");
            return;
        }

        axios
            .delete(`${Test_Api}background/details`, {
                data: { arrBackgroundId: [deleteID] },
            })
            .then((response) => {
                console.log("Deleted Reels Data ==>", response.data);
                toast.success("Background Iamges deleted successfully!");
                fetchData();
                setDeleteId(null);
            })
            .catch((error) => {
                console.error("Error deleting reel:", error);
                toast.error("Error deleting reel.");
            });
    };
    return (
        <div>
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
            />
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-12">
                            <label htmlFor="video">Background Image</label>
                            <input
                                type="file"
                                name="file"
                                id="images"
                                className="form-control mb-3"
                                onChange={handleFileChange}
                                ref={fileInputRef} // Attach the ref to the input
                            />
                            {preview && (
                                <img
                                    crossOrigin="anonymous"
                                    src={preview}
                                    style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                                />
                            )}
                        </div>
                        <div className="col-lg-12 text-center">
                            <button type="submit" className="btn btn-success">Add Data</button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Reels Table */}
            <div className="side-container my-5">
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Images</th>
                                <th>Delete/Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {background.length > 0 ? (
                                background.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>
                                            <img
                                                crossOrigin="anonymous"
                                                src={`${Img_Url}${item.vImage}`}
                                                style={{ width: '200px', height: '200px' }}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger mx-2"
                                                onClick={() => setDeleteId(item._id)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button
                                                className="btn btn-success mx-2"
                                                onClick={() => toast.info("Update functionality not implemented yet.")}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan="3" className="py-3">Data Not Found!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                deleteID={deleteID}
                handleDelete={handleDelete}
            />
        </div>
    )
}
