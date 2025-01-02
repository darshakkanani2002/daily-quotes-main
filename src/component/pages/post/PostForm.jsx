import React from 'react'
import LanguageSelect from '../../language/LanguageSelected'
import Select from 'react-select';

export default function PostForm({
    options,
    handleSubmit,
    selectedLanguage,
    handleLanguageSelect,
    postData,
    setPostData,
    selectedCategory,
    handleCategorySelect,
    handleFileChange,
    fileInputRef,
    preview,
    vLanguageId,
    isUpdating,
    handleChange }) {
    return (
        <div>
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
                        <div className='col-lg-12 mb-3 d-none'>
                            <div>
                                <label htmlFor="languagecode">Language Code<span className='text-danger'>*</span></label>
                                <input type="text" className='form-control' value={postData.vLanguageCode}
                                    onChange={(e) => setPostData({ ...postData, vLanguageCode: e.target.value })}
                                    required />

                                {/* <select type='text' className="form-select" aria-label="Default select example"
                                    value={postData.vLanguageCode}
                                    onChange={(e) => setPostData({ ...postData, vLanguageCode: e.target.value })}
                                    required
                                >
                                    <option value='' disabled>Open this select menu</option>
                                    <option value="hi">hi</option>
                                    <option value="en">en</option>
                                    <option value="gu">gu</option>
                                    <option value="ts">ts</option>
                                </select> */}
                            </div>
                        </div>
                        <div className='col-lg-12 mb-3'>
                            <label htmlFor="category">Category Name<span className='text-danger'>*</span></label>
                            <Select
                                id="category"
                                className='mb-3'
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
                                checked={postData.isTime}
                                onChange={handleChange}
                                className='post-checkbox-input-1'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTrending</label>
                            <input
                                type="checkbox"
                                name="isTrending"
                                checked={postData.isTrending}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className='col-lg-6 mb-3'>
                            <label htmlFor="image">Image</label>
                            <input type="file" name="file" id="image" className='form-control'
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {preview && <img crossOrigin="anonymous" src={preview} alt="Preview" className='img-fluid mt-2 post-select-icon' />}
                        </div>
                        <div className='col-lg-12 mb-2 text-center'>
                            <button type='submit' className='btn btn-success'>{isUpdating ? ("Update Dtata") : ("Submit Data")}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
