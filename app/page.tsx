'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code, Brain, Zap, Users, ArrowRight, MessageSquare, Github, Linkedin, Mail, Menu, X, Bot, BarChart3, Eye, Settings } from 'lucide-react'
import ChatWidget from '../components/ChatWidget'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    handleScroll() // Set initial state
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    {
      title: "AI Integration & Automation",
      price: "$8K-$25K",
      icon: Brain,
      description: "We identify where AI actually adds value to your operations, then build custom integrations that deliver measurable results.",
      bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Custom Software Development", 
      price: "$15K-$50K",
      icon: Bot,
      description: "Full-stack applications built with proven technologies. We focus on reliability, performance, and long-term maintainability.",
      bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Advanced AI Development",
      price: "$35K+ Premium",
      icon: Zap,
      description: "Cutting-edge AI solutions using our proprietary development methodology. For complex projects requiring specialized expertise.",
      bgImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Data Analytics & Intelligence",
      price: "$12K-$30K",
      icon: BarChart3,
      description: "Transform your data into actionable insights. We build analytics systems that actually influence business decisions.",
      bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Computer Vision Solutions",
      price: "$20K-$45K",
      icon: Eye,
      description: "Practical computer vision applications for quality control, automation, and analysis. Proven results in real-world environments.",
      bgImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Technical Consultation",
      price: "$200/hour",
      icon: Settings,
      description: "Strategic guidance on AI implementation, architecture decisions, and technology selection. Honest assessment of what will work.",
      bgImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ]

  const stats = [
    { number: "10+", label: "Active Development Projects" },
    { number: "96GB", label: "Local AI Processing Power" },
    { number: "5 Years", label: "Software Development Experience" }
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.1)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(37, 99, 235, 0.1)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1rem'
        }}>
          <div style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '700',
            fontFamily: 'monospace'
          }}>
            <span style={{ 
              color: '#2563eb',
              textShadow: '0 0 20px rgba(37, 99, 235, 0.3)'
            }}>{"{"}CrucialCodeLabs{"}"}</span>
          </div>
          <div style={{
            display: 'flex',
            gap: '1.5rem'
          }} className="hidden-mobile">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.color = '#2563eb'}
                onMouseOut={(e) => (e.target as HTMLElement).style.color = '#374151'}
              >
                {item}
              </a>
            ))}
          </div>
          <button 
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{
            padding: '1rem 1rem',
            borderTop: '1px solid #e5e7eb',
            background: 'white'
          }}>
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                style={{
                  display: 'block',
                  padding: '0.75rem 0',
                  color: '#374151',
                  textDecoration: 'none',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        id="home" 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          paddingTop: '80px',
          padding: '80px 1rem 4rem 1rem',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              fontWeight: '700',
              lineHeight: '1.2',
              marginBottom: '1.5rem',
              color: 'white',
              wordBreak: 'break-word'
            }}
          >
            Revolutionizing Business with <span style={{ color: '#60a5fa' }}>AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.5rem)',
              maxWidth: '800px', 
              margin: '0 auto 2rem auto',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              padding: '0 1rem'
            }}
          >
            We build intelligent software solutions using advanced AI development tools and proven methodologies. 
            Our focus is on practical applications that deliver measurable business value.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2rem',
              padding: '0 1rem'
            }}
          >
            <a 
              href="#services" 
              style={{
                background: '#2563eb',
                color: 'white',
                padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                minWidth: 'fit-content'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.background = '#1d4ed8';
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.background = '#2563eb';
                (e.target as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              Our Services
              <ArrowRight size={20} />
            </a>
            <a 
              href="#contact" 
              style={{
                background: 'transparent',
                color: 'white',
                padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
                border: '2px solid white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                transition: 'all 0.3s ease',
                minWidth: 'fit-content'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.background = 'white';
                (e.target as HTMLElement).style.color = '#1f2937'
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.background = 'transparent';
                (e.target as HTMLElement).style.color = 'white'
              }}
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: '4rem 1rem',
        background: '#f8fafc'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="AI technology" 
                style={{
                  width: '100%',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
            <div>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 6vw, 3rem)',
                fontWeight: '700',
                marginBottom: '2rem',
                color: '#1f2937',
                lineHeight: '1.2'
              }}>
                About <span style={{ color: '#2563eb' }}>CrucialCodeLabs</span>
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                marginBottom: '1.5rem',
                color: '#4b5563',
                lineHeight: '1.7'
              }}>
                We specialize in practical AI implementations that solve real business problems. 
                Our development approach combines proven software engineering principles with cutting-edge AI technologies.
              </p>
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                marginBottom: '2rem',
                color: '#4b5563',
                lineHeight: '1.7'
              }}>
                Every project starts with understanding your specific needs and challenges. 
                We then apply the right combination of technologies to deliver solutions that actually work in your environment.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem'
              }}>
                {stats.map((stat, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: 'clamp(1rem, 3vw, 1.5rem)',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    <h3 style={{
                      fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                      color: '#2563eb',
                      lineHeight: '1.1'
                    }}>{stat.number}</h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      lineHeight: '1.3',
                      margin: 0
                    }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services" 
        style={{
          padding: '4rem 1rem',
          color: 'white',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(30, 58, 138, 0.9)), url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 6vw, 3rem)',
            fontWeight: '700',
            marginBottom: '3rem',
            textAlign: 'center',
            color: 'white',
            lineHeight: '1.2'
          }}>
            Our <span style={{ color: '#60a5fa' }}>Services</span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#1f2937',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    padding: 'clamp(1.5rem, 4vw, 2rem)',
                    borderRadius: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{
                    color: '#2563eb',
                    marginBottom: '1.5rem'
                  }}>
                    <Icon size={48} />
                  </div>
                  <h3 style={{
                    fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#1f2937',
                    lineHeight: '1.3'
                  }}>{service.title}</h3>
                  <p style={{
                    color: '#2563eb',
                    marginBottom: '1rem',
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                    fontWeight: '600'
                  }}>{service.price}</p>
                  <p style={{
                    color: '#4b5563',
                    lineHeight: '1.6',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    margin: 0
                  }}>{service.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section style={{
        padding: '4rem 1rem',
        background: '#f8fafc',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 6vw, 3rem)',
            fontWeight: '700',
            marginBottom: '2rem',
            color: '#1f2937',
            lineHeight: '1.2'
          }}>
            Our <span style={{ color: '#2563eb' }}>Development</span> Approach
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            color: '#4b5563',
            lineHeight: '1.7'
          }}>
            We leverage advanced development tools and methodologies to deliver high-quality software solutions efficiently and reliably.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <div style={{
              background: 'white',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                color: '#2563eb',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Code size={64} />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#1f2937',
                lineHeight: '1.3'
              }}>Modern Development Practices</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                margin: 0
              }}>We use contemporary development tools and AI-assisted workflows to build software faster without compromising quality.</p>
            </div>
            <div style={{
              background: 'white',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                color: '#2563eb',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Users size={64} />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#1f2937',
                lineHeight: '1.3'
              }}>Client-Focused Solutions</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                margin: 0
              }}>Every solution is designed around your specific business requirements and existing infrastructure.</p>
            </div>
            <div style={{
              background: 'white',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                color: '#2563eb',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Zap size={64} />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#1f2937',
                lineHeight: '1.3'
              }}>Proven Implementation</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                margin: 0
              }}>We follow established software engineering practices and testing methodologies to ensure reliable deployments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        style={{
          padding: '4rem 1rem',
          color: 'white',
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(30, 58, 138, 0.9)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 6vw, 3rem)',
              fontWeight: '700',
              marginBottom: '2rem',
              textAlign: 'center',
              color: 'white',
              lineHeight: '1.2'
            }}>
              Get in <span style={{ color: '#60a5fa' }}>Touch</span>
            </h2>
            <p style={{
              textAlign: 'center',
              marginBottom: '3rem',
              maxWidth: '600px',
              margin: '0 auto 3rem auto',
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              Ready to discuss your project? Let&apos;s have an honest conversation about your needs and how we can help achieve your goals.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '3rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: 'clamp(1.3rem, 4vw, 1.5rem)',
                  fontWeight: '700',
                  marginBottom: '2rem',
                  color: 'white'
                }}>Contact Information</h3>
                <div style={{ marginBottom: '3rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <Mail size={24} style={{ marginRight: '1rem', color: '#60a5fa', flexShrink: 0 }} />
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', margin: 0, wordBreak: 'break-word' }}>contact@crucialcodelabs.com</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <Github size={24} style={{ marginRight: '1rem', color: '#60a5fa', flexShrink: 0 }} />
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', margin: 0, wordBreak: 'break-word' }}>github.com/crucialcodelabs</p>
                  </div>
                </div>
                
                <h3 style={{
                  fontSize: 'clamp(1.3rem, 4vw, 1.5rem)',
                  fontWeight: '700',
                  marginBottom: '1.5rem',
                  color: 'white'
                }}>Follow Us</h3>
                <div style={{
                  display: 'flex',
                  gap: '1.5rem'
                }}>
                  <Github size={32} style={{ cursor: 'pointer', color: 'white' }} />
                  <Linkedin size={32} style={{ cursor: 'pointer', color: 'white' }} />
                  <Mail size={32} style={{ cursor: 'pointer', color: 'white' }} />
                </div>
              </div>
              
              <div>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                      fontWeight: '500',
                      color: 'white'
                    }}>Name</label>
                    <input 
                      type="text"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                      fontWeight: '500',
                      color: 'white'
                    }}>Email</label>
                    <input 
                      type="email"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                      fontWeight: '500',
                      color: 'white'
                    }}>Message</label>
                    <textarea
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        color: 'white',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        resize: 'none',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      background: '#2563eb',
                      color: 'white',
                      padding: 'clamp(0.75rem, 3vw, 1rem) 2rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => (e.target as HTMLElement).style.background = '#1d4ed8'}
                    onMouseOut={(e) => (e.target as HTMLElement).style.background = '#2563eb'}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: 'white',
        padding: '3rem 1rem',
        borderTop: '1px solid #374151'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              fontWeight: '700',
              fontFamily: 'monospace',
              flex: '1 1 auto'
            }}>
              <span style={{ 
                color: '#60a5fa',
                textShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
              }}>{"{"}Crucial</span>
              <span style={{ 
                color: 'white',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}>CodeLabs{"}"}</span>
            </div>
            <div style={{ flex: '1 1 auto' }}>
              <p style={{ color: '#9ca3af', margin: 0, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>&copy; 2025 CrucialCodeLabs. All rights reserved.</p>
            </div>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flex: '1 1 auto',
              justifyContent: 'center'
            }}>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>Privacy Policy</a>
              <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none;
          }
        }
        input::placeholder, textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
