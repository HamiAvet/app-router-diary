
export default function createEvent() {
    
    return (
        <div className="createEvent_container">
            <div className="title_input_div">
                <label htmlFor="title">Title</label>
                <input id="title" type="text" className="title_input" maxLength={40} />
            </div>
            <div className="topic_input_div">
                <label htmlFor="topic">Topic</label>
                <input id="topic" type="text" className="topic_input" />
            </div>
            <div>
                <label>Category</label>
                <select name="ategory">
                    <option value="option1">hobbies</option>
                    <option value="option2">work</option>
                    <option value="option3">health</option>
                    <option value="option3">shopping</option>
                    <option value="option3">sport</option>
                    <option value="option3">administrative</option>
                    <option value="option3">household</option>
                    <option value="option3">festivities</option>
                </select>
            </div>
            <div>
                <div>
                    <label htmlFor="topic">Topic</label>
                    <input id="topic" type="date" className="topic_input" />
                </div>
                <div>
                    <label htmlFor="topic">Topic</label>
                    <input id="topic" type="time" className="topic_input" />
                </div>
            </div>
            <div>
                <button type="submit">Confirm</button>
                <button>Cancel</button>
            </div>
        </div>
        
    )
}