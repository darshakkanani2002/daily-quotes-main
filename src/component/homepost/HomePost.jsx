import React, { useEffect, useRef, useState } from 'react';
import LanguageSelect from '../language/LanguageSelected';
import Select from 'react-select';
import axios from 'axios';
import { Img_Url, Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import Pagination from '../pagination/Pagination';

export default function HomePost({ selectedLanguage }) {
    const [homepost, setHomepost] = useState([]);
    const [homepostData, setHomePostData] = useState({
        _id: '',
        vCatId: '',
        vLanguageId: '',
        vImages: '',
        dtCreatedAt: '',
        isTrending: false,
        isPremium: false,
        isTime: false,
    });
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const fileInputRef = useRef(null);
    const [deleteID, setDeleteId] = useState(null);
    const [preview, setPreview] = useState(null);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;  // Display 12 posts per page

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
                iPage: 1,
                iLimit: 33,
                vCatId: homepostData.vCatId,
                vLanguageId: homepostData.vLanguageId,
            });
            console.log('Home Post Data List', response.data.data);
            setHomepost(response.data.data);
        } catch (error) {
            console.error('Error fetching home posts:', error.response ? error.response.data : error.message);
        }
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setHomePostData((prevState) => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : '',
            vCatId: '' // Reset category ID
        }));
        setSelectedCategory(null); // Reset selected category
        setOptions([]);
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
        const formData = new FormData();
        const catId = homepostData.vLanguageId || selectedCategory?.id;
        const vCatId = homepostData.vCatId || selectedCategory?.id;

        if (isUpdating) {
            formData.append('vHomePostId', currentId); // Include the post ID in the form data
            formData.append('vCatId', vCatId);
            formData.append('vLanguageId', catId);
            formData.append('isTime', homepostData.isTime);
            formData.append('isPremium', homepostData.isPremium);
            formData.append('isTrending', homepostData.isTrending);

            axios.put(`${Test_Api}homePost/details`, { vHomePostId: currentId, vCatId: vCatId, vLanguageId: catId }, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log('Home Post Updated:', response.data.data);
                    setHomePostData({
                        vCatId: homepostData.vCatId,
                        vLanguageId: homepostData.vLanguageId,
                        vImages: '',
                        dtCreatedAt: '',
                        isTrending: false,
                        isPremium: false,
                        isTime: false,
                    });
                    fetchData(vCatId);
                })
                .catch(error => {
                    console.error('Error updating data:', error.response ? error.response.data : error.message);
                });
        } else {
            formData.append('vCatId', homepostData.vCatId);
            formData.append('vLanguageId', homepostData.vLanguageId);
            formData.append('vImages', homepostData.vImages);
            formData.append('isTime', homepostData.isTime);
            formData.append('isTrending', homepostData.isTrending);
            formData.append('isPremium', homepostData.isPremium);

            axios.post(`${Test_Api}homePost/details`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log('Home Post Saved:', response.data.data);
                    toast.success('Home Post saved successfully!');
                    resetForm();
                    setHomePostData({
                        vCatId: homepostData.vCatId,
                        vLanguageId: homepostData.vLanguageId,
                        vImages: '',
                        dtCreatedAt: '',
                        isTrending: false,
                        isPremium: false,
                        isTime: false,
                    });
                    fetchData(catId);
                })
                .catch(error => {
                    console.error('Error saving data:', error.response ? error.response.data : error.message);
                });
        }
    };

    const resetForm = () => {
        setHomePostData({
            vCatId: '',
            vLanguageId: '',
            vImages: '',
            dtCreatedAt: '',
            isTrending: false,
            isPremium: false,
            isTime: false,
        });
        setPreview(null);
        setIsUpdating(false);
        setCurrentId(null);
    };

    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setHomePostData((prevState) => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : '',
        }));
        console.log('Selected Category:', selectedOption);
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setHomePostData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHomePostData((prev) => ({ ...prev, vImages: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = (post) => {
        setIsUpdating(true);
        setCurrentId(post._id);
        setHomePostData({
            vCatId: post.vCatId,
            vLanguageId: post.vLanguageId,
            vImages: post.vImages,
            dtDate: post.dtDate,
            isTrending: post.isTrending,
            isPremium: post.isPremium,
            isTime: post.isTime,
        });
        if (post.vImages) {
            setPreview(`${Img_Url}${post.vImages}`);
        }
    };

    const handleDelete = () => {
        const catId = homepostData.vLanguageId || selectedCategory?.id;
        axios
            .delete(`${Test_Api}homePost/details`, {
                data: { arrImageId: [deleteID] },
            })
            .then(response => {
                console.log('Deleted:', response.data);
                fetchData(catId);
                toast.success('Post deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting post:', error.response ? error.response.data : error.message);
            });
    };

    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = homepost.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(homepost.length / postsPerPage);

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
                            />
                        </div>
                        <div className="col-lg-12">
                            <label>Image</label>
                            <input type="file" className="form-control mb-3" onChange={handleFileChange} ref={fileInputRef} multiple />
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
                            <button type="submit" className="btn btn-success">
                                {isUpdating ? 'Update Data' : 'Add Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='text-center mt-4'>
                <h3>Total Home Post: {homepost.length}</h3>
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
                        {currentPosts.length > 0 ? (
                            currentPosts.map((item, id) => (
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
                                    <td>{formatDate(item.dtCreatedAt)}</td>
                                    <td>{item.isTime ? 'true' : 'false'}</td>
                                    <td>{item.isTrending ? 'true' : 'false'}</td>
                                    <td>{item.isPremium ? 'true' : 'false'}</td>

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
                                            onClick={() => handleUpdate(item)}
                                        >
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

            {/* Delete Modal */}
            <DeleteModal
                deleteID={deleteID}
                handleDelete={handleDelete}
            />

            {/* Pagination */}
            <Pagination
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePaginationClick={handlePaginationClick}
            ></Pagination>
        </div>
    );
}
