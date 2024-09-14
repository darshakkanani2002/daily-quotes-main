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
    handleColorChange,
    handleHexChange,
    isUpdating }) {
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
                        <div className='col-lg-12 mb-3'>
                            <div>
                                <label htmlFor="languagecode">Language Code<span className='text-danger'>*</span></label>

                                <select className="form-select" aria-label="Default select example"
                                    value={postData.vLanguageCode}
                                    onChange={(e) => setPostData({ ...postData, vLanguageCode: e.target.value })}
                                    required
                                >
                                    <option value='' disabled>Open this select menu</option>
                                    <option value="hi">hi</option>
                                    <option value="en">en</option>
                                    <option value="guj">guj</option>
                                    <option value="ts">ts</option>
                                </select>
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
                        <div className='col-lg-6 mb-3'>
                            <label htmlFor="image">Image</label>
                            <input type="file" name="file" id="image" className='form-control'
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {preview && <img crossOrigin="anonymous" src={preview} alt="Preview" className='img-fluid mt-2 post-select-icon' />}
                        </div>
                        <div className='col-lg-2 mb-2'>
                            <div className="d-inline-block">
                                <label htmlFor="startcolor">Start Color</label>
                                <input
                                    type="text"
                                    className='form-control post-hex-color'
                                    name='vStartColor'
                                    value={postData.vStartColor}
                                    onChange={(e) => setPostData({ ...postData, vStartColor: e.target.value })}
                                    placeholder='Enter Start Color'
                                />
                                <input
                                    type="color"
                                    name="vStartColor"
                                    id="startcolor"
                                    className='form-control p-0 color-input d-none'
                                    value={postData.vStartColor.slice(0, 7)}
                                    onChange={handleColorChange} // Handle color picker change
                                />
                                <input
                                    type="text"
                                    className='form-control post-hex-color d-none'
                                    name="vStartColor"
                                    value={postData.vStartColor}
                                    onChange={handleHexChange} // Handle text input change
                                    placeholder="#RRGGBBAA"
                                />
                            </div>
                        </div>
                        <div className='col-lg-2 mb-2'>
                            <div className="d-inline-block">
                                <label htmlFor="endcolor">End Color</label>
                                <input
                                    type="text"
                                    className='form-control post-hex-color'
                                    name='vEndColor'
                                    value={postData.vEndColor}
                                    onChange={(e) => setPostData({ ...postData, vEndColor: e.target.value })}
                                    placeholder='Enter End Color'
                                />
                                <input
                                    type="color"
                                    name="vEndColor"
                                    id="endcolor"
                                    className='form-control p-0 color-input d-none'
                                    value={postData.vEndColor.slice(0, 7)}
                                    onChange={handleColorChange} // Handle color picker change
                                />
                                <input
                                    type="text"
                                    className='form-control post-hex-color d-none'
                                    name="vEndColor"
                                    value={postData.vEndColor}
                                    onChange={handleHexChange} // Handle text input change
                                    placeholder="#RRGGBBAA"
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
                                <input
                                    type="text"
                                    className='form-control post-hex-color'
                                    name='vTextColor'
                                    value={postData.vTextColor}
                                    onChange={(e) => setPostData({ ...postData, vTextColor: e.target.value })} />
                            </div>
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
