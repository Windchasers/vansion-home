import { ProjectsData, Project, Category, ProjectDetailedInfo } from '../types/project';
import projectsData from '../data/projects.json';
import projectDetailsData from '../data/projectDetails.json';
import { processProjectImages, processProjectsImages } from './imageUtils';

/**
 * 获取所有项目类别
 * @returns 项目类别数组
 */
export function getCategories(): Category[] {
  return projectsData.categories;
}

/**
 * 获取所有项目类别 (别名函数，与getCategories功能相同)
 * @returns 项目类别数组
 */
export function getAllCategories(): Category[] {
  return projectsData.categories;
}

/**
 * 获取所有项目
 * @returns 项目数组
 */
export function getAllProjects(): Project[] {
  return processProjectsImages(projectsData.projects);
}

/**
 * 根据ID获取单个项目
 * @param id 项目ID
 * @returns 项目对象或undefined
 */
export function getProjectById(id: number | string): Project | undefined {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const project = projectsData.projects.find(project => project.id === numericId);
  return project ? processProjectImages(project) : undefined;
}

/**
 * 根据类别获取项目
 * @param categoryId 类别ID
 * @returns 项目数组
 */
export function getProjectsByCategory(categoryId: string): Project[] {
  if (categoryId === 'all') {
    return processProjectsImages(projectsData.projects);
  }
  const filteredProjects = projectsData.projects.filter(project => project.category === categoryId);
  return processProjectsImages(filteredProjects);
}

/**
 * 获取项目类别名称
 * @param categoryId 类别ID
 * @returns 类别名称
 */
export function getCategoryName(categoryId: string): string {
  const category = projectsData.categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
}

/**
 * 根据项目ID获取项目详细信息
 * @param id 项目ID
 * @returns 项目详细信息对象或undefined
 */
export function getProjectDetailById(id: number | string): Project | undefined {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const projectDetail = projectDetailsData.projects.find(project => project.id === numericId);
  
  // 如果在详细信息中找到项目，返回完整的项目信息
  if (projectDetail) {
    return projectDetail;
  }
  
  // 如果在详细信息中没有找到，返回基本项目信息
  return getProjectById(numericId);
}

/**
 * 根据语言环境获取本地化的项目详情
 * @param id 项目ID
 * @param language 语言代码
 * @returns 本地化后的项目对象或undefined
 */
export function getLocalizedProjectDetailById(id: number | string, language: string): Project | undefined {
  const project = getProjectDetailById(id);
  if (!project) return undefined;
  
  // 创建一个新的项目对象，根据当前语言选择相应的字段
  const localizedProject: Project = {
    ...project,
    title: typeof project.title === 'object' ? project.title[language] || project.title.zh : project.title,
    subtitle: typeof project.subtitle === 'object' ? project.subtitle[language] || project.subtitle.zh : project.subtitle,
    client: typeof project.client === 'object' ? project.client[language] || project.client.zh : project.client,
    services: Array.isArray(project.services) ? project.services : 
              (typeof project.services === 'object' ? project.services[language] || project.services.zh : [project.services]),
    description: typeof project.description === 'object' ? project.description[language] || project.description.zh : project.description,
    content: Array.isArray(project.content) ? project.content : 
             (typeof project.content === 'object' ? project.content[language] || project.content.zh : [project.content])
  };
  
  // 处理详细信息的本地化
  if (project.detailedInfo) {
    localizedProject.detailedInfo = {
      ...project.detailedInfo,
      challenge: typeof project.detailedInfo.challenge === 'object' ? 
                project.detailedInfo.challenge[language] || project.detailedInfo.challenge.zh : 
                project.detailedInfo.challenge,
      solution: typeof project.detailedInfo.solution === 'object' ? 
                project.detailedInfo.solution[language] || project.detailedInfo.solution.zh : 
                project.detailedInfo.solution,
      process: Array.isArray(project.detailedInfo.process) ? project.detailedInfo.process : 
               (typeof project.detailedInfo.process === 'object' ? 
                project.detailedInfo.process[language] || project.detailedInfo.process.zh : 
                [project.detailedInfo.process]),
      results: typeof project.detailedInfo.results === 'object' ? 
               project.detailedInfo.results[language] || project.detailedInfo.results.zh : 
               project.detailedInfo.results,
      duration: typeof project.detailedInfo.duration === 'object' ? 
                project.detailedInfo.duration[language] || project.detailedInfo.duration.zh : 
                project.detailedInfo.duration,
      location: typeof project.detailedInfo.location === 'object' ? 
                project.detailedInfo.location[language] || project.detailedInfo.location.zh : 
                project.detailedInfo.location,
      technologies: project.detailedInfo.technologies
    };
    
    // 处理团队成员信息
    if (project.detailedInfo.teamMembers) {
      if (Array.isArray(project.detailedInfo.teamMembers)) {
        // 新格式：对象数组，每个对象包含name和role
        if (typeof project.detailedInfo.teamMembers[0] === 'object') {
          localizedProject.detailedInfo.teamMembers = project.detailedInfo.teamMembers.map(member => ({
            name: typeof member.name === 'object' ? member.name[language] || member.name.zh : member.name,
            role: typeof member.role === 'object' ? member.role[language] || member.role.zh : member.role
          }));
        } else {
          // 旧格式：字符串数组
          localizedProject.detailedInfo.teamMembers = project.detailedInfo.teamMembers.map(member => ({
            name: member,
            role: ''
          }));
        }
      } else {
        localizedProject.detailedInfo.teamMembers = [];
      }
    }
    
    // 处理推荐语信息
    if (project.detailedInfo.testimonial) {
      if (typeof project.detailedInfo.testimonial === 'object') {
        // 新格式：包含quote、author和position的对象
        if (project.detailedInfo.testimonial.quote) {
          localizedProject.detailedInfo.testimonial = {
            quote: typeof project.detailedInfo.testimonial.quote === 'object' ? 
                   project.detailedInfo.testimonial.quote[language] || project.detailedInfo.testimonial.quote.zh : 
                   project.detailedInfo.testimonial.quote,
            author: typeof project.detailedInfo.testimonial.author === 'object' ? 
                    project.detailedInfo.testimonial.author[language] || project.detailedInfo.testimonial.author.zh : 
                    project.detailedInfo.testimonial.author,
            position: typeof project.detailedInfo.testimonial.position === 'object' ? 
                      project.detailedInfo.testimonial.position[language] || project.detailedInfo.testimonial.position.zh : 
                      project.detailedInfo.testimonial.position
          };
        } else {
          // 旧格式：字符串
          localizedProject.detailedInfo.testimonial = {
            quote: project.detailedInfo.testimonial.toString(),
            author: '',
            position: ''
          };
        }
      } else {
        // 旧格式：字符串
        localizedProject.detailedInfo.testimonial = {
          quote: project.detailedInfo.testimonial.toString(),
          author: '',
          position: ''
        };
      }
    }
  }
  
  return localizedProject;
}

/**
 * 获取项目的详细信息部分
 * @param id 项目ID
 * @returns 项目详细信息对象或undefined
 */
export function getProjectDetailedInfo(id: number | string): ProjectDetailedInfo | undefined {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const projectDetail = projectDetailsData.projectDetails.find(project => project.id === numericId);
  
  return projectDetail?.detailedInfo;
}