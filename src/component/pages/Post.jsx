import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Test_Api } from '../Config';
import LanguageSelect from '../language/LanguageSelected';
import DeleteModal from '../modal/DeleteModal';
import { toast, ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Post({ selectedLanguage }) {
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [post, setPost] = useState([]);
    const [postData, setPostData] = useState({
        _id: '',
        vCatId: '',
        vStartColor: '#000000',
        vEndColor: '#000000',
        vTextColor: '#000000',
        // vLanguageCode: '',
        vLanguageId: '',
        vImages: '',
        vFrameId: ''
    });

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [deleteID, setDeleteId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    useEffect(() => {
        if (postData.vLanguageId) {
            loadOptions();
        }
    }, [postData.vLanguageId]);

    // Fetch Data --------------------------------------------------------------------
    const fetchData = (vCatId) => {
        axios.post(`${Test_Api}post/withoutLoginList`, { vCatId })
            .then(response => {
                console.log("Post Data List ==>", response.data.data);
                setPost(response.data.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    // Category Load Option Data ---------------------------------------------------------------------------------------
    const loadOptions = async () => {
        if (!postData.vLanguageId) return;

        try {
            console.log('Fetching categories with vLanguageId:', postData.vLanguageId);

            const response = await axios.post(`${Test_Api}category/list`, {
                vlanguageId: postData.vLanguageId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Categories API Response:', response.data.data);

            if (response.data.data) {
                const data = response.data.data.map(category => ({
                    label: category.vName,
                    value: category._id,
                    id: category._id
                }));
                setOptions(data);
            } else {
                console.error('No data found in response');
            }
        } catch (error) {
            console.error('Error fetching options:', error.response ? error.response.data : error.message);
        }
    };

    // For language Id select Data ---------------------------------------------------------------------------------------
    const handleLanguageSelect = (selectedLanguage) => {
        setPostData(prevState => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : ''
        }));
        if (selectedLanguage) {
            console.log("Selected Options ===>", selectedLanguage);
        }
    };

    // Category Select Handle ---------------------------------------------------------------------------------------------
    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setPostData(prevState => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : ''
        }));
        console.log("Selected Category ===>", selectedOption);

        // Fetch data for the selected category
        if (selectedOption && selectedOption.id) {
            fetchData(selectedOption.id); // Pass the selected category id to fetch data
        }
    };
    // Handle File Change -----------------------------------------------------------------
    // Inside the Post component

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPostData({ ...postData, vImages: file });  // Set the file in state
            setPreview(URL.createObjectURL(file));  // Set the preview URL
        }
    };

    // Submit Handle ----------------------------------------------------------------------------------------------------
    const handleSubmit = (e, _id) => {
        e.preventDefault();

        if (!postData.vCatId) {
            toast.error("Category is required!");
            return;
        }

        if (isUpdating && !postData.vFrameId) {
            toast.error("vFrameId is required for updating!");
            return;
        }

        const formData = new FormData();
        formData.append('vCatId', postData.vCatId);
        formData.append('vStartColor', postData.vStartColor);
        formData.append('vEndColor', postData.vEndColor);
        formData.append('vTextColor', postData.vTextColor);
        // formData.append('vLanguageId', postData.vLanguageId);

        if (postData.vImages) {
            formData.append('vImages', postData.vImages);
        }

        if (isUpdating) {
            if (postData.vFrameId) {
                formData.append('vFrameId', postData.vFrameId);
            } else {
                console.error("vFrameId is undefined or null");
            }

            // Debug: Log formData entries
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            axios.put(`${Test_Api}post/details`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log(response.data);
                    setIsUpdating(false);  // Reset update mode
                    fetchData(postData.vCatId);
                    toast.success("Post updated successfully!");
                })
                .catch(error => {
                    console.log("Error while updating:", error.response ? error.response.data : error.message);
                    toast.error("Update failed. Please check the category selection.");
                });
        } else {
            // Creating a new post
            axios.post(`${Test_Api}post/details`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log("Post Save Data ==>", response.data);
                    fetchData(postData.vCatId)
                    resetForm();  // Reset form after successful creation
                    toast.success("Post created successfully!");
                })
                .catch(error => {
                    console.log("Error while creating:", error.response ? error.response.data : error.message);
                    toast.error("Creation failed. Please check the category selection.");
                });
        }
    };

    const resetForm = () => {
        setPostData({
            vStartColor: '#000000',
            vEndColor: '#000000',
            vTextColor: '#000000',
            vLanguageId: '',
            vImages: ''
        });
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';  // Reset file input
        }
        setIsUpdating(false);  // Reset update mode
    };



    // handle update data------------------------------------------------
    // handle update data------------------------------------------------
    const handleUpdate = (post, _id) => {
        setIsUpdating(true);  // Set the state to updating mode
        setCurrentId(_id);  // Store the current post ID
        setPostData({
            vCatId: post.vCatId || '', // Ensure category ID is set
            vStartColor: post.vStartColor || '#000000',
            vEndColor: post.vEndColor || '#000000',
            vTextColor: post.vTextColor || '#000000',
            vLanguageId: post.vLanguageId || '',
            vImages: post.vImages || ''
        });

        // If the image is already set, create a preview
        if (post.vImages) {
            setPreview(`http://192.168.1.3:4500/${post.vImages}`);
        }
    };


    // Delete Handle ----------------------------------------------
    const handleDelete = () => {
        axios.delete(`${Test_Api}post/details`, {
            data: { vImageId: deleteID }
        }).then(response => {
            console.log("Deleted Post Data Response:", response.data);
            fetchData(postData.vCatId); // Re-fetch data
            toast.warning('Language deleted successfully!');
        }).catch(error => {
            console.log("Delete Error:", error);
        });
    }

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
                transition:Bounce
            />
            <div className='my-3'>
                <div className='side-container category-form p-3'>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-lg-12 mb-3'>
                                <label>Select Language <span className='text-danger'>*</span></label>
                                <LanguageSelect
                                    value={selectedLanguage} // Ensure this matches the format expected by LanguageSelect
                                    handleLanguageSelect={handleLanguageSelect}
                                />
                            </div>
                            <div className='col-lg-12 mb-3'>
                                <label htmlFor="category">Category Name</label>
                                <Select
                                    id="category"
                                    className='mb-3'
                                    value={selectedCategory}
                                    onChange={handleCategorySelect}
                                    options={options}
                                    required
                                />
                            </div>
                            <div className='col-lg-6 mb-3'>
                                <label htmlFor="image">Image</label>
                                <input type="file" name="file" id="image" className='form-control'
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                                {preview && <img crossOrigin="anonymous" src={preview} alt="Preview" className='img-fluid mt-2 category-select-icon' />}
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className='d-inline-block'>
                                    <label htmlFor="startcolor">Start Color</label>
                                    <input type="color" name="startcolor" id="startcolor" className='form-control p-0 color-input' value={postData.vStartColor} onChange={(e) => setPostData({ ...postData, vStartColor: e.target.value })} />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="endcolor">End Color</label>
                                    <input type="color" name="endcolor" id="endcolor" className='form-control p-0 color-input' value={postData.vEndColor} onChange={(e) => setPostData({ ...postData, vEndColor: e.target.value })} />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="textcolor">Text Color</label>
                                    <input type="color" name="textcolor" id="textcolor" className='form-control p-0 color-input' value={postData.vTextColor} onChange={(e) => setPostData({ ...postData, vTextColor: e.target.value })} />
                                </div>
                            </div>
                            {/* <div className='col-lg-3 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="languagecode">Language Code</label>
                                    <input
                                        type="text"
                                        name="languagecode"
                                        id="languagecode"
                                        className='form-control'
                                        value={postData.vLanguageCode}
                                        onChange={(e) => setPostData({ ...postData, vLanguageCode: e.target.value })}
                                    />
                                </div>
                            </div> */}
                            <div className='col-lg-12 mb-2 text-center'>
                                <button type='submit' className='btn btn-success'>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>

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
                                {post.length > 0 ? (
                                    post.map((item, id) => (
                                        <tr key={id}>
                                            <td>{id + 1}</td>
                                            <td>
                                                <img crossOrigin="anonymous" src={`http://192.168.1.3:4500/${item.vImages}`} alt="images" className='post-table-image' />
                                            </td>
                                            <td><input type="color" value={item.vStartColor} readOnly /></td>
                                            <td><input type="color" value={item.vEndColor} readOnly /></td>
                                            <td><input type="color" value={item.vTextColor} readOnly /></td>
                                            {/* <td>{item.vLanguageCode}</td> */}
                                            <td>
                                                <button className='btn btn-danger mx-2' title='Delete' onClick={() => setDeleteId(item._id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                                <button className='btn btn-success mx-2' title='Update' onClick={() => handleUpdate(item)}>
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className='text-center'>
                                        <td colSpan="7" className='p-2'>
                                            <div className='data-not-found-bg'>
                                                <img src="/images/question.png" alt="question" className='img-fluid data-no-found-ic' />
                                                <span className='table-data-not-found-text mt-1 d-block'>Data Not Found !</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Delete Modal */}
                <DeleteModal deleteID={deleteID} handleDelete={handleDelete}></DeleteModal>
            </div>
        </div>
    );
}
