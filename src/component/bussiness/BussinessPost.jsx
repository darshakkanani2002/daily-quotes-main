import React, { useEffect, useRef, useState } from 'react'
import BussinessLanguageSelect from './BussinessLanguageSelect'
import Select from 'react-select';
import { Img_Url, Test_Api } from '../Config';
import axios from 'axios';

export default function BussinessPost({ selectedLanguage }) {
    const [bussinessPost, setBussinessPost] = useState([]);
    const [bussinessPostData, setBussinessPostData] = useState({
        _id: '',
        vCatId: '',
        vLanguageId: '',
        vImages: '',
        isTrending: false,
        isPremium: false,
        isTime: false,
    });
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    useEffect(() => {
        loadOptions();
    }, [bussinessPostData.vLanguageId]);

    useEffect(() => {
        if (bussinessPostData.vCatId && bussinessPostData.vLanguageId) {
            fetchData();
        }
    }, [bussinessPostData.vCatId, bussinessPostData.vLanguageId]);

    const fetchData = async (page = 1, limit = 33) => {
        try {
            const response = await axios.post(`${Test_Api}businessCatPost/withoutLoginList`, {
                iPage: 1,
                iLimit: 33,
                vCatId: bussinessPostData.vCatId,
                vLanguageId: bussinessPostData.vLanguageId,
            });
            console.log('Home Post Data List', response.data.data);
            setBussinessPost(response.data.data);
        } catch (error) {
            console.error('Error fetching home posts:', error.response ? error.response.data : error.message);
        }
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setBussinessPostData((prevState) => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : '',
        }));
        setOptions([]);
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        setBussinessPostData((prev) => {
            const newState = { ...prev, [name]: updatedValue };
            console.log('Updated State:', newState); // Logs the full state
            return newState;
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBussinessPostData((prev) => ({ ...prev, vImages: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setBussinessPostData((prevState) => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : '',
        }));
        console.log('Selected Category:', selectedOption);
    };

    const loadOptions = async () => {
        try {
            console.log('Fetching categories with vLanguageId:', bussinessPostData.vLanguageId);

            const response = await axios.post(
                `${Test_Api}businessSubCat/list`,
                { vCatId: bussinessPostData.vLanguageId },
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
    const handleSubmit = (e) => {
        e.preventDefault();
        const catId = bussinessPostData.vLanguageId || selectedCategory?.id;
        const vCatId = bussinessPostData.vCatId || selectedCategory?.id;
        axios.post(`${Test_Api}businessCatPost/details`, { vCatId: bussinessPostData.vCatId, vLanguageId: bussinessPostData.vLanguageId, isTrending: bussinessPostData.isTrending, isPremium: bussinessPostData.isPremium, isTime: bussinessPostData.isTime }).then(response => {
            console.log("Bussiness Post Data Save ==>", response.data.data);
            setBussinessPostData({
                vCatId: bussinessPostData.vCatId,
                vLanguageId: bussinessPostData.vLanguageId,
                vImages: '',
                isTrending: false,
                isPremium: false,
                isTime: false,
            });
            fetchData(vCatId);
        }).catch(error => {
            console.log(error);

        })
    }
    return (
        <div>
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label>
                                Language Id
                            </label>
                            <BussinessLanguageSelect
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
                                checked={bussinessPostData.isTime}
                                onChange={handleChange}
                                className='post-checkbox-input-1'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTrending</label>
                            <input
                                type="checkbox"
                                name="isTrending"
                                checked={bussinessPostData.isTrending}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isPremium</label>
                            <input
                                type="checkbox"
                                name="isPremium"
                                checked={bussinessPostData.isPremium}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                Date <span className="text-danger">*</span>
                            </label>
                            <input
                                value={bussinessPostData.dtDate || ''} // Ensure a fallback for null or undefined
                                type="date"
                                className="form-control mb-3"
                                onChange={(e) => setBussinessPostData({ ...bussinessPostData, dtDate: e.target.value })}
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
                            <button type="submit" className="btn btn-success">
                                {isUpdating ? 'Update Data' : 'Add Data'}
                            </button>
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
                        {bussinessPost.length > 0 ? (
                            bussinessPost.map((item, id) => (
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
        </div>
    )
}
