import type { FAQType, MemberType, ServiceType, TestimonialType } from "@/types";
import type { BlogType } from "./types";

const serviceData: ServiceType[] = [
    {
        duration: 800,
        image: 'assets/img/all-images/header_default_cenefco.jpg',
        id: 1,
        title: 'Bright Spark Services',
        description: 'Explore our range of services below & discover how you power your life',
    },
    {
        duration: 1000,
        image: 'assets/img/all-images/header_default_cenefco.jpg',
        id: 2,
        title: 'Energy Ease Packages',
        description: 'With cutting-edge technology & industry expertise, we empower',
    },
    {
        duration: 1200,
        image: 'assets/img/all-images/header_default_cenefco.jpg',
        id: 3,
        title: 'Electra Care Packages',
        description: 'Our team of experts is committed to delivering high-quality services',
    },
]

const workData = [
{
    id: 1,
    icon: 'fa-solid fa-comment-dots',
    duration: 800,
    title: 'Bienvenida y presentación',
    description: 'Nuestro asistente te saluda, se presenta y te guía desde el primer momento para encontrar el programa ideal según tus objetivos.',
    color: '#128AA2',
    accent: '#128AA2',
},
{
    id: 2,
    icon: 'fa-solid fa-graduation-cap',
    duration: 1000,
    title: 'Oferta académica',
    description: 'Diplomados, cursos de especialización y programas ejecutivos. Todos con docentes expertos, modalidad virtual y certificación reconocida.',
    color: '#FC8900',
    accent: '#e07a00',
},
{
    id: 3,
    icon: 'fa-solid fa-certificate',
    duration: 1200,
    title: 'Certificación y beneficios',
    description: 'Certificado con sello institucional, verificable por QR, constancia de horas y acceso a la red de egresados CENEFCO.',
    color: '#128AA2',
    accent: '#128AA2',
},
{
    id: 4,
    icon: 'fa-solid fa-clipboard-list',
    duration: 1400,
    title: 'Inscripción y cupos',
    description: 'Cupos limitados. Inscribite en menos de 10 minutos con pago en cuotas y descuentos por inscripción anticipada.',
    color: '#FC8900',
    accent: '#e07a00',
}]

const teamMembers:MemberType[] = [
    {
        name: 'Shoaib Bashir',
        role: 'Sales Manager',
        image: 'assets/img/all-images/team-img1.png',
    },
    {
        name: 'William Thompson',
        role: 'Product Manager',
        image: 'assets/img/all-images/team-img2.png',
    },
    {
        name: 'Reece Toply',
        role: 'Team Leader',
        image: 'assets/img/all-images/team-img3.png',
    },
    {
        name: 'Robert Anderson',
        role: 'Sales Manager',
        image: 'assets/img/all-images/team-img4.png',
    }
];

const faqData:FAQType[] = [
    {
        question: "How do I sign up for your electricity services?",
        answer: "Whether you're wondering about our pricing plans, process installation , or sustainability initiatives."
    },
    {
        question: "What types of electricity plans do you offer?",
        answer: "Whether you're wondering about our pricing plans, process installation , or sustainability initiatives."
    },
    {
        question: "What are your billing and payment options?",
        answer: "Whether you're wondering about our pricing plans, process installation , or sustainability initiatives."
    },
    {
        question: "How can I track my energy usage with your services?",
        answer: "Whether you're wondering about our pricing plans, process installation , or sustainability initiatives."
    }
];

const blogs: BlogType[] = [
    {
        image: 'assets/img/all-images/blog-img1.png',
        title: 'Electrifying Reads Explore Our Electricity',
        date: 'April 2, 2024',
        category: 'Electricity Corner',
        description: 'Are you considering studying abroad and embarking on an visa to',
        aos: 'flip-left',
        duration: 800
    },
    {
        image: 'assets/img/all-images/blog-img2.png',
        title: 'Empowering Energy Dive into Our Electricity',
        date: 'April 2, 2024',
        category: 'Electricity Corner',
        description: 'From understanding our pricing plans to learning about our renewable',
        aos: 'flip-right',
        duration: 1000
    },
    {
        image: 'assets/img/all-images/blog-img3.png',
        title: 'Electricity Explained: Bloggin Power of Tomorrow',
        date: 'April 2, 2024',
        category: 'Electricity Corner',
        description: "We're committed to ensuring that you have all the information you need.",
        aos: 'flip-left',
        duration: 1200
    }
];

const testimonialData:TestimonialType[] = [
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img2.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
    },
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img3.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
    },
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img4.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
    },
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img5.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
    },
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img1.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
    },
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img2.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
    },
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img3.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
    },
    {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img4.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img5.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img2.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img1.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img2.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img3.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img4.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img5.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      },
      {
        message: `“But don't just take our word for it – hear what our best satisfied customers have to say! From homeowners to businesses, our clients have experienced the difference our services make in their daily lives. Discover how to work we've helped businesses thrive client.`,
        authorImg: 'assets/img/all-images/testimonial-img2.png',
        name: 'Shakib Mahmud',
        role: 'Happy Client',
      }
]

export { serviceData, workData, teamMembers, faqData, blogs,testimonialData }