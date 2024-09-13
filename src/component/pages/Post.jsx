import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Test_Api } from '../Config';
import LanguageSelect from '../language/LanguageSelected';
import DeleteModal from '../modal/DeleteModal';
import { toast, ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../pagination/Pagination';
export default function Post({ selectedLanguage }) {
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [post, setPost] = useState([]);
    const [postData, setPostData] = useState({
        _id: '',
        vCatId: '',
        vStartColor: '#000000', // Use a default color or empty string if necessary
        vEndColor: '#000000', // Use a default color or empty string
        vTextColor: '#000000', // Use a default color or empty string
        vLanguageId: '',
        vImages: '',
    });

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [deleteID, setDeleteId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 12;  // Display 12 posts per page

    useEffect(() => {
        if (postData.vLanguageId) {
            loadOptions();
        }
    }, [postData.vLanguageId]);

    // Fetch Data --------------------------------------------------------------------
    const fetchData = (vCatId) => {
        if (!vCatId) {
            console.error('vCatId is missing.');
            return;
        }
        axios.post(`${Test_Api}post/withoutLoginList`, { vCatId })
            .then(response => {
                console.log("Post Data List ==>", response.data.data);
                setPost(response.data.data); // Ensure response.data.data exists
            })
            .catch(error => {
                console.error('Error fetching data:', error);
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

    const rgbaToHex = (r, g, b, a, alphaScale) => {
        const alpha = Math.round(a * alphaScale).toString(16).padStart(2, '0');
        return `#${alpha}${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const hexToRgba = (hex, alphaScale) => {
        let r = 0, g = 0, b = 0, a = 1;

        if (hex.length === 9) { // Full 8-char hex (#AARRGGBB)
            a = parseInt(hex.slice(1, 3), 16) / alphaScale; // Alpha from first 2 characters
            r = parseInt(hex.slice(3, 5), 16);
            g = parseInt(hex.slice(5, 7), 16);
            b = parseInt(hex.slice(7, 9), 16);
        } else if (hex.length === 7) { // RGB only (#RRGGBB)
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    };
    const handleColorChange = (e) => {
        const { name, value } = e.target;
        const alphaScale = name === 'vStartColor' ? 80 : 32; // Custom alpha scale per color field

        // Convert hex color to RGBA and then back to 8-char hex
        const rgbaColor = hexToRgba(value, alphaScale); // Append 'FF' to handle alpha as fully opaque
        const [r, g, b, a] = rgbaColor.match(/\d+(\.\d+)?/g).map(Number);

        // Convert RGBA back to 8-char hex
        const hexColor = rgbaToHex(r, g, b, a, alphaScale);

        setPostData(prevState => ({
            ...prevState,
            [name]: hexColor
        }));
    };

    const handleHexChange = (e) => {
        const { name, value } = e.target;
        const alphaScale = 100; // Custom alpha scale per color field

        // Validate if hex code is in correct format
        if (/^#[0-9A-Fa-f]{8}$/.test(value)) {
            setPostData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // handleUpdate function
    const handleUpdate = (post) => {
        setIsUpdating(true);  // Set the state to updating mode
        setCurrentId(post._id);  // Store the current post ID

        // Log fetched post colors
        console.log("Fetched Post Colors:", {
            vStartColor: post.vStartColor,
            vEndColor: post.vEndColor,
            vTextColor: post.vTextColor
        });

        setPostData({
            _id: post._id,  // Set the _id as the vFrameId
            vCatId: post.vCatId,  // Ensure category ID is set
            vStartColor: post.vStartColor || '#000000', // Default color if value is null
            vEndColor: post.vEndColor || '#000000', // Default color if value is null
            vTextColor: post.vTextColor || '#000000', // Default color if value is null
            vLanguageId: post.vLanguageId || '',
            vImages: post.vImages || ''
        });

        // If the image is already set, create a preview
        if (post.vImages) {
            setPreview(`http://192.168.1.3:4500/${post.vImages}`);
        }
    };

    // Handle form submission to ensure colors are sent correctly
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        // Check if a category has already been selected and stored, otherwise use the current selection.
        const catId = postData.vCatId || selectedCategory?.id;

        if (!catId) {
            toast.error("Please select a category.");
            return;
        }

        formData.append('vCatId', catId);  // Ensure category ID is appended
        formData.append('vStartColor', postData.vStartColor || '#000000');  // Ensure color is appended
        formData.append('vEndColor', postData.vEndColor || '#000000');
        formData.append('vTextColor', postData.vTextColor || '#000000');

        if (postData.vImages) {
            formData.append('vImages', postData.vImages);
        }

        if (isUpdating) {
            if (!postData._id) {
                toast.error("vFrameId is missing! Please try again.");
                return;
            }

            axios.put(`${Test_Api}post/details`, { vFrameId: postData._id }, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    console.log("Post Updated data ==>", response.data.data);
                    setIsUpdating(false);
                    toast.success("Post updated successfully!");
                    resetForm();
                    fetchData(catId);  // Use the correct vCatId here

                })
                .catch(error => {
                    console.error("Update failed:", error.response ? error.response.data : error.message);
                    toast.error("Update failed. Please check the category selection.");
                });
        } else {
            // Creating a new post
            axios.post(`${Test_Api}post/details`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    const responseData = response.data.data;
                    setPostData(prevState => ({
                        ...prevState,
                        vCatId: responseData.vCatId,  // Ensure category ID is retained
                        _id: responseData._id,
                    }));
                    console.log("Created Post Data ==>", response.data);

                    resetForm();
                    toast.success("Post created successfully!");
                    fetchData(catId);  // Fetch posts for the selected category
                })
                .catch(error => {
                    console.error("Creation failed:", error.response ? error.response.data : error.message);
                    toast.error("Creation failed. Please check the category selection.");
                });
        }
    };




    // Delete Handle ----------------------------------------------
    const handleDelete = () => {
        const catId = postData.vCatId || selectedCategory?.id;
        axios.delete(`${Test_Api}post/details`, {
            data: { vImageId: deleteID }
        }).then(response => {
            console.log("Deleted Post Data Response:", response.data);
            fetchData(catId); // Re-fetch data
            toast.warning('Language deleted successfully!');
        }).catch(error => {
            console.log("Delete Error:", error);
        });
    }

    // --------------------------------------------------------------------
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

    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = post.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(post.length / postsPerPage);

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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
                                <div className="d-inline-block">
                                    <label htmlFor="startcolor">Start Color</label>
                                    <input
                                        type="color"
                                        name="vStartColor"
                                        id="startcolor"
                                        className='form-control p-0 color-input'
                                        value={postData.vStartColor.slice(0, 7)}
                                        onChange={handleColorChange} // Handle color picker change
                                    />
                                    <input
                                        type="text"
                                        name="vStartColor"
                                        value={postData.vStartColor}
                                        onChange={handleHexChange} // Handle text input change
                                        placeholder="#RRGGBB"
                                    />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="endcolor">End Color</label>
                                    <input
                                        type="color"
                                        name="vEndColor"
                                        id="endcolor"
                                        className='form-control p-0 color-input'
                                        value={postData.vEndColor.slice(0, 7)}
                                        onChange={handleColorChange} // Handle color picker change
                                    />
                                    <input
                                        type="text"
                                        name="vEndColor"
                                        value={postData.vEndColor}
                                        onChange={handleHexChange} // Handle text input change
                                        placeholder="#RRGGBB"
                                    />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="textcolor">Text Color</label>
                                    <input
                                        type="color"
                                        name="vTextColor"
                                        id="textcolor"
                                        className='form-control p-0 color-input'
                                        value={postData.vTextColor}
                                        onChange={(e) => setPostData({ ...postData, vTextColor: e.target.value })}  // Correctly update the state
                                    />
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
                                <button type='submit' className='btn btn-success'>{isUpdating ? ("Update Dtata") : ("Submit Data")}</button>
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
                                {Array.isArray(post) && post.length > 0 ? (
                                    currentPosts.map((item, id) => (
                                        <tr key={id}>
                                            <td>{id + 1}</td>
                                            <td>
                                                <img crossOrigin="anonymous" src={`http://192.168.1.3:4500/${item.vImages}`} alt="images" style={{ width: '60px', height: 'auto' }} />
                                            </td>
                                            <td>
                                                <div>{item.vStartColor}</div>
                                                <input type="color" value={item.vStartColor.slice(0, 7)} name="startcolor" id="startcolor" readOnly />
                                            </td> {/* Ensure color is displayed */}
                                            <td>
                                                <div>{item.vEndColor}</div>
                                                <input type="color" value={(item.vEndColor.slice(0, 7))} name="endcolor" id="endcolor" readOnly />
                                            </td> {/* Ensure color is displayed */}
                                            <td>
                                                <div>{item.vTextColor}</div>
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
                {/* Delete Modal */}
                <DeleteModal deleteID={deleteID} handleDelete={handleDelete}></DeleteModal>
            </div>

            {/* Pagination Controls */}
            <div className="container">
                {/* Form and other post logic */}
                {/* Pagination */}
                <Pagination
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePaginationClick={handlePaginationClick}
                ></Pagination>
            </div>
        </div>
    );
}
