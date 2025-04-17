const Checkbox = {
  parts: ['control'],

  baseStyle: {
    control: {
      borderColor: 'gray.400',
      color: 'gray.600',
      border: '1px solid',
      bg: 'inherit',
      borderRadius: '2px',
      transitionProperty: 'dissolve',
      transitionDuration: '300ms',
      _checked: {
        bg: 'black.600',
        color: 'white',
        icon: {
          color: 'white'
        }
      },
      _active: {
        bg: 'black.600',
        icon: {
          color: 'white'
        }
      },
      _hover: {
        bg: 'transparent',
        icon: {
          color: 'white'
        }
      },
      _disabled: {
        borderColor: 'gray.200',
        color: 'gray.200',
        border: '2px solid',
        bg: 'gray.200'
      },
      _invalid: {
        border: '2px solid #FF4842'
      }
    }
  },

  defaultProps: {
    // Reset props
    variant: 'null',
    size: 'sm'
  }
};

export default Checkbox;
