const Button = {
  // The styles all button have in common
  baseStyle: {
    bg: 'primary.main',
    color: 'white',
    fontSize: '18px',
    fontWeight: '1000',
    letterSpacing: '0.75%',
    borderRadius: '6px',
    _hover: {
      bg: 'hoverColor'
    },
    _active: {
      bg: 'primary.main'
    },
    _disabled: {
      bg: 'primary.main'
    }
  },
  // Two sizes: sm and md
  sizes: {
    xs: {
      fontSize: '12px',
      lineHeight: '16px',
      padding: '10px, 8px, 10px, 8px'
    },
    sm: {
      fontSize: '14px',
      lineHeight: '20px',
      padding: '10px, 12px, 10px, 12px'
    },
    md: {
      fontSize: '16px',
      lineHeight: '24px',
      padding: '10px, 16px, 10px, 16px'
    },
    lg: {
      fontSize: '18px',
      lineHeight: '28px',
      padding: '10px, 24px, 10px, 24px'
    }
  },
  // Two variants: outline and solid
  variants: {
    base: {},
    primary: {
      bg: 'primary.main',
      borderRadius: '8px',
      boxShadow: '-4px -4px 50px rgba(4, 41, 122, 0.1), 4px 4px 50px rgba(4, 41, 122, 0.1)',
      fontWeight: 700,
      color: 'white',
      _hover: {
        bg: 'primary.main'
      }
    },
    outline: {
      border: '1px solid',
      borderColor: 'primary.main',
      bg: 'secondary.main',
      _hover: {
        bg: 'secondary.main'
      },
      _active: {
        bg: 'secondary.main'
      }
    },
    outlineSecondary: {
      border: '1px solid',
      borderColor: 'primary.main',
      bg: 'white',
      color: 'black.1000',
      _hover: {
        bg: 'white',
        color: 'black.1000'
      },
      _active: {
        bg: 'white',
        color: 'black.1000'
      }
    },
    menu: {
      bg: 'transparent',
      color: 'black.600',
      fontWeight: '500',
      _hover: {
        bg: 'gray.200'
      },
      _active: {
        bg: 'gray.300'
      }
    },
    menuSolid: {
      bg: 'black',
      color: 'white',
      fontWeight: '500',
      _hover: {
        bg: 'black',
        color: 'white'
      },
      _active: {
        bg: 'black',
        color: 'white'
      }
    },
    list: {
      bg: 'transparent',
      color: 'black.600',
      fontWeight: '500',
      height: 'auto',
      borderRadius: 0,
      px: 8,
      py: 1,
      _hover: {
        bg: 'gray.100'
      },
      _active: {
        bg: 'gray.100'
      }
    },
    icon: {
      bg: 'transparent',
      color: 'gray.800',
      fontWeight: '500',
      border: '1px solid #C5C5C5',
      _hover: {
        bg: 'transparent'
      },
      _active: {
        bg: 'transparent'
      },
      _disabled: {
        bg: 'transparent'
      }
    },
    iconOutline: {
      bg: 'transparent',
      border: '1px solid #C5C5C5',
      borderRadius: '8px',
      color: 'black',
      fontWeight: '500',
      _hover: {
        bg: 'transparent'
      },
      _active: {
        bg: 'transparent'
      },
      _disabled: {
        bg: 'transparent'
      }
    },
    text: {
      bg: 'transparent',
      color: 'gray.700',
      fontWeight: '500',
      height: 'auto',
      width: 'auto',
      minWidth: 0,
      p: '2px',
      _hover: {
        bg: 'transparent'
      },
      _active: {
        bg: 'transparent'
      },
      _disabled: {
        bg: 'transparent'
      }
    },

    sideBarTitle: {
      bg: 'gray.100',
      color: 'gray.700',
      fontWeight: '500',
      height: 'auto',
      width: 'auto',
      minWidth: 0,
      justifyContent: 'start',
      gap: 2,
      px: '20px',
      py: '10px',
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: '0px 8px 8px 0px',
      _hover: {
        background: 'transparent',
        boxShadow: 'none',
        borderRadius: '0px 8px 8px 0px'
      },
      _active: {
        background:
          'linear-gradient(90deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.7) 51.5%, rgba(0, 0, 0, 0.8) 96%)',
        boxShadow: '2px 2px 20px 2px rgba(0, 0, 0, 0.17)',
        borderRadius: '0px 8px 8px 0px'
      },

      _disabled: {}
    },
    sideBarTitleSelected: {
      bg: 'gray.100',
      color: 'gray.700',
      fontWeight: '500',
      height: 'auto',
      width: 'auto',
      minWidth: 0,
      justifyContent: 'start',
      gap: 2,
      px: '20px',
      py: '10px',
      background:
        'linear-gradient(90deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.7) 51.5%, rgba(0, 0, 0, 0.8) 96%)',
      boxShadow: '2px 2px 20px 2px rgba(0, 0, 0, 0.17)',
      borderRadius: '0px 8px 8px 0px',
      _hover: {
        background:
          'linear-gradient(90deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.7) 51.5%, rgba(0, 0, 0, 0.8) 96%)',
        boxShadow: '2px 2px 20px 2px rgba(0, 0, 0, 0.17)',
        borderRadius: '0px 8px 8px 0px'
      },
      _active: {
        background:
          'linear-gradient(90deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.7) 51.5%, rgba(0, 0, 0, 0.8) 96%)',
        boxShadow: '2px 2px 20px 2px rgba(0, 0, 0, 0.17)',
        borderRadius: '0px 8px 8px 0px'
      },

      _disabled: {}
    }
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'primary'
  }
};

export default Button;
