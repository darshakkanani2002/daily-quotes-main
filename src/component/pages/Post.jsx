import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Test_Api } from '../Config';
import LanguageSelect from '../language/LanguageSelected';

export default function Post({ selectedLanguage }) {
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [postData, setPostData] = useState({
        vCatId: '',
        vImage: '',
        vStartColor: '',
        vEndColor: '',
        vTextColor: '',
        vLanguageCode: '',
        vLanguageId: '' // Set default or dynamic value as needed
    });

    useEffect(() => {
        if (postData.vLanguageId) {
            loadOptions();
        }
    }, [postData.vLanguageId]);
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
    // category Select Handle ---------------------------------------------------------------------------------------------
    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setPostData(prevState => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : ''
        }));
        console.log("Selected Category ===>", selectedOption);
    };
    // Language code add handle -----------------------------------------------------------------
    const handleLanguageCodeChange = (event) => {
        setPostData(prevState => ({
            ...prevState,
            vLanguageCode: event.target.value
        }));
    };
    // Submit Handle----------------------------------------------------------------------------------------------------
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form data:', postData);
        // Handle form submission logic here
    };

    return (
        <div>
            <div className='my-3'>
                <div className='side-container category-form p-3'>
                    <form onSubmit={handleSubmit}>
                        <div className='row'>
                            <div className='col-lg-12 mb-3'>
                                <label>Select Language <span className='text-danger'>*</span></label>
                                <LanguageSelect
                                    value={selectedLanguage}// Ensure this matches the format expected by LanguageSelect
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
                                <input type="file" name="image" id="image" className='form-control' />
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className='d-inline-block'>
                                    <label htmlFor="startcolor">Start Color</label>
                                    <input type="color" name="startcolor" id="startcolor" className='form-control p-0 color-input' />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="endcolor">End Color</label>
                                    <input type="color" name="endcolor" id="endcolor" className='form-control p-0 color-input' />
                                </div>
                            </div>
                            <div className='col-lg-2 mb-2'>
                                <div className="d-inline-block">
                                    <label htmlFor="textcolor">Text Color</label>
                                    <input type="color" name="textcolor" id="textcolor" className='form-control p-0 color-input' />
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
                                        onChange={handleLanguageCodeChange}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-12 mb-2 text-center'>
                                <button type='submit' className='btn btn-success'>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
