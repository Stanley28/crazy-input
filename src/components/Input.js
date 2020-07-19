import React from 'react';
import '../styles/components/Input.css';

export default class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false,
            value: [],
            caretPosition: 0,
            isAllSelection: false
        };
        
        this.inputRef = React.createRef();
        
        window.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('keypress', this.onKeyPress.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    render() {
        const active = this.state.active;

        let value;
        const caret = <span className='crazy-input__caret'></span>;
        if (this.state.value.length === 0) {
            if (active) {
                value = caret;
            } else {
                value = '';
            }
        } else {
            value = this.state.value.map((item, index) =>
                <span className='crazy-input__value-item' key={index}>
                    {this.state.caretPosition === 0 && this.state.caretPosition === index && active && caret}
                    {item}
                    {this.state.caretPosition - 1  === index && this.state.caretPosition !== 0 && active && caret}
                </span>
            );
        }

        let inputClasses = 'crazy-input';
        inputClasses += active ? ' crazy-input_active' : '';
        inputClasses += this.state.isAllSelection ? ' crazy-input_select' : '';
        
        return (
            <div 
                ref={this.inputRef} 
                id={this.props.id} 
                className={inputClasses}
            >
                <div className='crazy-input__value'>
                    <span className='crazy-input__selection-overlay'></span>
                    {value}   
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onClick);
        window.removeEventListener('keypress', this.onKeyPress);
        window.removeEventListener('keydown', this.onKeyDown);
    }

    onClick(event) {
        if (this.inputRef.current !== event.target)  {
            this.setState({
                active: false,
                isAllSelection: false
            });
            
            return;
        }      

        event.stopPropagation();
        
        this.setState({
            active: true
        });
    }

    onKeyPress(event) {
        if (!this.state.active) {
            return;
        }
        
        this.setState({
            value: this.state.value.concat(event.key),
            caretPosition: ++this.state.caretPosition,
            isAllSelection: false
        });
    }

    onKeyDown(event) {
        if (!this.state.active) {
            return;
        }

        // backspace
        if (event.keyCode === 8 && this.state.caretPosition > 0) {
            if (this.state.isAllSelection) {
                this.setState({
                    value: [],
                    caretPosition: 0,
                    isAllSelection: false
                });

                return;
            }

            const clone = this.state.value.slice();
            clone.splice(this.state.caretPosition - 1, 1)
            this.setState({
                value: clone,
                caretPosition: --this.state.caretPosition
            });
        }

        // right
        if (event.keyCode === 39) {
            if (this.state.caretPosition < this.state.value.length) {
                this.setState({
                    caretPosition: ++this.state.caretPosition,
                    isAllSelection: false
                });
            }
        }

        // left
        if (event.keyCode === 37) {
            if (this.state.caretPosition > 0) {
                this.setState({
                    caretPosition: --this.state.caretPosition,
                    isAllSelection: false
                });
            }
        }

        // select
        if (event.keyCode === 65 && event.ctrlKey) {
            this.setState({
                isAllSelection: true
            });
        }

        // paste
        if (event.keyCode === 86 && event.ctrlKey) {
            navigator.clipboard.readText()
                .then(text => {
                    this.setState({
                        value: [...this.state.value, ...text.split('')],
                        caretPosition: this.state.value.length + text.length,
                        isAllSelection: false
                    })
                })
        }
    }
}