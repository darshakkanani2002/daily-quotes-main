import React, { useEffect, useRef, useState } from 'react';
import LanguageSelect from '../language/LanguageSelected';
import Select from 'react-select';
import axios from 'axios';
import { Img_Url, Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';

export default function HomePost({ selectedLanguage }) {
    const [homepost, setHomepost] = useState([]);
    const [homepostData, setHomePostData] = useState({
        _id: '',
        vCatId: '',
        vLanguageId: '',
        vImages: '',
        dtDate: '',
        isTrending: false, // Default to false
        isPremium: false, // Default to false
        isTime: false, // Default to false
    });
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    const fileInputRef = useRef(null);
    const [deleteID, setDeleteId] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        loadOptions();
    }, [homepostData.vLanguageId]);

    useEffect(() => {
        if (homepostData.vCatId && homepostData.vLanguageId) {
            fetchData();
        }
    }, [homepostData.vCatId, homepostData.vLanguageId]);

    const fetchData = async (page = 1, limit = 33) => {
        try {
            const response = await axios.post(`${Test_Api}homePost/withoutLoginList`, {
                iPage: page,
                iLimit: limit,
                vCatId: homepostData.vCatId, // Ensure vCatId is passed
                vLanguageId: homepostData.vLanguageId, // Ensure vLanguageId is passed
            });
            console.log("Home Post Data List", response.data.data);
            setHomepost(response.data.data);
        } catch (error) {
            console.error('Error fetching home posts:', error.response ? error.response.data : error.message);
        }
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setHomePostData((prevState) => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : '',
        }));
        setOptions([]); // Clear previous options when a new language is selected
    };

    const loadOptions = async () => {
        try {
            console.log('Fetching categories with vLanguageId:', homepostData.vLanguageId);

            const response = await axios.post(
                `${Test_Api}homeCategory/list`,
                { vLanguageId: homepostData.vLanguageId },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log('Categories API Response:', response.data.data);

            if (response.data.data) {
                const data = response.data.data.map((category) => ({
                    label: category.vName,
                    value: category._id,
                    id: category._id,
                }));
                setOptions(data);
            } else {
                console.error('No data found in response');
            }
        } catch (error) {
            console.error('Error fetching options:', error.response ? error.response.data : error.message);
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Create a FormData object
        const formData = new FormData();
        // Check if a category has already been selected and stored, otherwise use the current selection.
        const catId = homepostData.vCatId || selectedCategory?.id;

        if (!catId) {
            toast.error("Please select a category.");
            return;
        }
        formData.append('vCatId', homepostData.vCatId);
        formData.append('vLanguageId', homepostData.vLanguageId);
        formData.append('vImages', homepostData.vImages); // Add the file
        formData.append('dtDate', homepostData.dtDate);

        // Convert checkboxes to boolean
        formData.append('isTrending', homepostData.isTrending ? true : false);
        formData.append('isPremium', homepostData.isPremium ? true : false);
        formData.append('isTime', homepostData.isTime ? true : false);

        if (isUpdating) {
            // Append vHomePostId to the FormData for update
            formData.append('vHomePostId', currentId);

            axios.put(`${Test_Api}homePost/details`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            })
                .then(response => {
                    console.log("Home Post Updated List Data ==>", response.data.data);
                    setHomePostData({
                        vCatId: '',
                        vLanguageId: '',
                        vImages: '',
                        dtDate: '',
                        isTrending: '',
                        isPremium: '',
                        isTime: '',
                    });
                    setPreview(null); // Clear the preview
                    fetchData(catId);
                })
                .catch(error => {
                    console.log('Error updating data:', error.response ? error.response.data : error.message);
                });
        } else {
            axios
                .post(`${Test_Api}homePost/details`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Important for file uploads
                    },
                })
                .then((response) => {
                    console.log('Home Post save Data ==>', response.data.data);
                    setHomePostData({
                        vCatId: '',
                        vLanguageId: '',
                        vImages: '',
                        dtDate: '',
                        isTrending: '',
                        isPremium: '',
                        isTime: '',
                    });
                    setPreview(null); // Clear the preview
                    fetchData(catId);
                })
                .catch((error) => {
                    console.log('Error submitting data:', error.response ? error.response.data : error.message);
                });
        }
    };


    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setHomePostData((prevState) => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : '',
        }));
        console.log('Selected Category ===>', selectedOption);
    };

    // Handle Cahnge for isTime and isTrending Checkbox----------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Log to console if isTime checkbox is changed
        if (name === 'isTime') {
            console.log('isTime:', checked);
        } else if (name === 'isTrending') {
            console.log('isTrending', checked)
        } else if (name === 'isPremium') {
            console.log('isPremium', checked)
        }

        setHomePostData({
            ...homepostData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle File Change -----------------------------------------------------------------
    // Inside the Post component

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHomePostData({ ...homepostData, vImages: file }); // Store the file object
            setPreview(URL.createObjectURL(file)); // Show a preview
        }
    };
    // Handle Update Data
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

        setHomePostData({
            vCatId: post.vCatId,
            vLanguageId: post.vLanguageId,
            vImages: post.vImages,
            dtDate: post.dtDate,
            isTrending: post.isTrending, // Default to false
            isPremium: post.isPremium, // Default to false
            isTime: post.isTime, // Default to false
        });

        // If the image is already set, create a preview
        if (post.vImages) {
            setPreview(`${Img_Url}${post.vImages}`);
        }
    };
    // Delete Category Data API
    const handleDelete = () => {
        const languagesId = homepostData.vLanguageId || selectedLanguage?.id;
        axios
            .delete(`${Test_Api}homePost/details`, {
                data: { arrImageId: [deleteID] },
            })
            .then((response) => {
                console.log('Deleted Category Data ==>', response.data);
                fetchData(languagesId);
                toast.success('Category deleted successfully!');
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div>
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label>
                                Language Id
                            </label>
                            <LanguageSelect
                                value={selectedLanguage}
                                handleLanguageSelect={handleLanguageSelect}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label>
                                Category Name
                            </label>
                            <Select
                                id="category"
                                className="mb-3"
                                value={selectedCategory}
                                onChange={handleCategorySelect}
                                options={options}
                                required
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTime</label>
                            <input
                                type="checkbox"
                                name="isTime"
                                checked={homepostData.isTime}
                                onChange={handleChange}
                                className='post-checkbox-input-1'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTrending</label>
                            <input
                                type="checkbox"
                                name="isTrending"
                                checked={homepostData.isTrending}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isPremium</label>
                            <input
                                type="checkbox"
                                name="isPremium"
                                checked={homepostData.isPremium}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                Date <span className="text-danger">*</span>
                            </label>
                            <input
                                value={homepostData.dtDate || ''} // Ensure a fallback for null or undefined
                                type="date"
                                className="form-control mb-3"
                                onChange={(e) => setHomePostData({ ...homepostData, dtDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-lg-12">
                            <label>Image</label>
                            <input type="file" className="form-control mb-3" onChange={handleFileChange} ref={fileInputRef} />
                            {preview && (
                                <img
                                    crossOrigin="anonymous"
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: '100px', marginTop: '10px' }}
                                />
                            )}
                        </div>
                        <div className='col-lg-12 mb-2 text-center'>
                            <button type='submit' className='btn btn-success'>Add Data</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="table-responsive side-container mt-5">
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Images</th>
                            <th>Date</th>
                            <th>isTime</th>
                            <th>isTrending</th>
                            <th>isPremium</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {homepost.length > 0 ? (
                            homepost.map((item, id) => (
                                <tr key={id}>
                                    <td>{id + 1}</td>
                                    <td>
                                        <img
                                            crossOrigin="anonymous"
                                            src={`${Img_Url}${item.vImages}`}
                                            alt={`${item.vImages}`}
                                            className="category-icon"
                                        />
                                    </td>
                                    <td>{item.dtDate}</td>
                                    <td>{item.isTime ? 'true' : 'false'}</td>
                                    <td>{item.isTrending ? 'true' : 'false'}</td>
                                    <td>{item.isPremium ? 'true' : 'false'}</td>

                                    <td>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => handleUpdate(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => setDeleteId(item._id)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteModal"
                                        >
                                            Delete
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

            {/* Delete Modal */}
            <DeleteModal
                deleteID={deleteID}
                handleDelete={handleDelete}
            />
        </div>
    );
}
