import React from 'react';
import { EditableComponent } from './EditableComponent';
import { BwmFileUploadEdit } from '../form/BwmFileUploadEdit';

export class EditableImage extends EditableComponent {

  constructor() {
    super();

    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  handleImageUpload(image) {
    this.setState({value: image});

    this.update();
  }

  render() {
    const { isActive, value } = this.state;

    return (
      <div className='editableComponent'>
        { !isActive &&
          <React.Fragment>
                        <div className='col'>
          { (value === 'none') &&
              <img src={'https://s3.eu-west-2.amazonaws.com/bwm-image-dev/1553036875365'} alt=''/>
                  }       
          { !(value === 'none') &&

                                    <div className='img-upload-container'>
                          <div className='img-preview'
                                style={{'backgroundImage': 'url(' + value + ')'}}>
                          </div>
                      </div>
              }
<div>
            <button onClick={() => this.enableEdit() }
                className='btn btn-warning btn-editable btn-editable-image'
                type='button'> Edit
            </button>
</div>
            </div>
          </React.Fragment>
        }

        { isActive &&
          <React.Fragment>

<div className='col'>
<div>
            <button onClick={() => this.disableEdit() }
                  className='btn btn-warning btn-upload'
                  type='button'> Cancel
            </button>
</div>
            <BwmFileUploadEdit imageURL={value}
                              onChange={this.handleImageUpload}>
            </BwmFileUploadEdit>
</div>

          </React.Fragment>
        }
      </div>
    )
  }
}
