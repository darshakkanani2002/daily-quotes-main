import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Test_Api } from '../Config';
import LanguageSelect from '../language/LanguageSelected';
import DeleteModal from '../modal/DeleteModal';

export default function Post({ selectedLanguage }) {
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [post, setPost] = useState([]);
    const [postData, setPostData] = useState({
        vCatId: '',
        vStartColor: '',
        vEndColor: '',
        vTextColor: '',
        vLanguageCode: '',
        vLanguageId: '',
    });

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [deleteID, setDeleteId] = useState(null)

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
    const handleFileChange = async (e, _id) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append(e.target.name, file);
        try {
            const res = await axios.post(`${Test_Api}addImage/details`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            // Assuming the API returns the paths of the uploaded images
            if (e.target.name === "vImage") {
                setPostData(prevState => ({
                    ...prevState,
                    vImages: res.data.data.vImage
                }));
            }
            console.log("Uploaded Data ===>", res.data.data);
        } catch (err) {
            console.error("Error uploading images:", err);
        }
    };

    // Submit Handle ----------------------------------------------------------------------------------------------------
    const handleSubmit = (event) => {
        event.preventDefault();

        // Create a shallow copy of postData and remove vLanguageId before submitting
        const submitData = { ...postData };
        delete submitData.vLanguageId; // Remove vLanguageId

        // Log the data being sent to the API
        console.log('Form data before submission:', submitData);

        // Check if vImages exists and include it in the submission if necessary
        if (postData.vImages) {
            submitData.vImages = postData.vImages;
        }

        console.log('Form data:', submitData);

        // Submit the modified data
        axios.post('http://192.168.1.3:4500/api/v1/post/details', submitData)
            .then(response => {
                console.log("post data ==>", response.data);
                setPostData({
                    vCatId: '',
                    vStartColor: '',
                    vEndColor: '',
                    vTextColor: '',
                    vLanguageCode: '',
                    vLanguageId: '' // Reset vLanguageId
                });
                fetchData(postData.vCatId);
            })
            .catch(error => {
                console.log(error);
            });
    };


    // Delete Handle --------------------------
    const handleDelete = () => {
        axios.delete('http://192.168.1.3:4500/api/v1/post/details', {
            data: { vImageId: deleteID }
        }).then(response => {
            console.log("Deleted Post Data ==>", response.data);;
            fetchData(postData.vCatId);
        }).catch(error => {
            console.log(error);

        })
    }

    return (
        <div>
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
                            {/* <div className='col-lg-6 mb-3'>
                                <label htmlFor="image">Image</label>
                                <input type="file" name="vImage" id="image" className='form-control'
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                                
                                {postData.vImages && (
                                    <img crossOrigin="anonymous" src={`http://192.168.1.3:4500/${postData.vImages}`} alt="images" style={{ width: '100px', height: 'auto' }} />
                                )}
                            </div> */}
                            <div className='col-lg-6  mb-3'>

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
                            <div className='col-lg-3 mb-2'>
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
                            </div>
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
                                    <th>Language Code</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {post.length > 0 ? (
                                    post.map((item, id) => (
                                        <tr key={id}>
                                            <td>{id + 1}</td>
                                            <td>
                                                <img crossOrigin="anonymous" src={`http://192.168.1.3:4500/${item.vImages}`} alt="images" style={{ width: '100px', height: 'auto' }} />
                                            </td>
                                            <td><input type="color" value={item.vStartColor} readOnly /></td>
                                            <td><input type="color" value={item.vEndColor} readOnly /></td>
                                            <td><input type="color" value={item.vTextColor} readOnly /></td>
                                            <td>{item.vLanguageCode}</td>
                                            <td>
                                                <button className='btn btn-danger mx-2' title='Delete' onClick={() => setDeleteId(item._id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                                <button className='btn btn-success mx-2' title='Update'>
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className='text-center'>
                                        <td colSpan="7" className='py-3'>
                                            <img src="/images/ic-content.svg" alt="ic-content" className='img-fluid' />
                                            <span className='table-data-not-found-text mt-1 d-block'>Data Not Found !</span>
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
