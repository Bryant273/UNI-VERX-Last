
'use client';

import React from 'react';
import { studentData } from '@/lib/static-data';
import { coursesResultsData, semesterResults, type CourseResult } from '@/lib/results-data';
import { getLogoSvg } from '@/components/logo';

interface BulletinPDFProps {
  displayType: string;
  semester: string;
  courseId: string;
}

const getGradeStyle = (grade: string): React.CSSProperties => {
  if (!grade) return {};
  const numericGrade = parseFloat(grade.split('/')[0].replace(',', '.'));
  if (numericGrade >= 16) return { color: '#16a34a', fontWeight: 'bold' };
  if (numericGrade >= 14) return { color: '#2563eb', fontWeight: 'bold' };
  if (numericGrade >= 10) return { color: '#ca8a04', fontWeight: 'bold' };
  return { color: '#dc2626', fontWeight: 'bold' };
};

export default function BulletinPDF({ displayType, semester, courseId }: BulletinPDFProps) {
  const renderHeader = () => (
     <header style={{ borderBottom: '2px solid #3F51B5', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#3F51B5', textAlign: 'center' }}>Bulletin de Résultats</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div dangerouslySetInnerHTML={{ __html: getLogoSvg() }} style={{ flexShrink: 0 }} />
            <div style={{ marginLeft: '15px', flexGrow: 1 }}>
                <p style={{ margin: '0 0 2px 0', fontSize: '11px' }}><strong style={{ color: '#000' }}>Nom:</strong> {studentData.name.split(' ').pop()}</p>
                <p style={{ margin: '0 0 2px 0', fontSize: '11px' }}><strong style={{ color: '#000' }}>Prénom(s):</strong> {studentData.name.split(' ').slice(0, -1).join(' ')}</p>
                <p style={{ margin: '0 0 2px 0', fontSize: '11px' }}><strong style={{ color: '#000' }}>Matricule:</strong> {studentData.id}</p>
                <p style={{ margin: '0', fontSize: '11px' }}><strong style={{ color: '#000' }}>Classe:</strong> {studentData.class}</p>
            </div>
        </div>
    </header>
  );

  const renderCourseDetail = () => {
    const courseData = coursesResultsData[courseId as keyof typeof coursesResultsData];
    if (!courseData) return null;

    return (
      <>
        {renderHeader()}
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>Détail de la matière : {courseData.name}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
                <tr>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Évaluation</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Note</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Coefficient</th>
                </tr>
            </thead>
            <tbody>
                {courseData.details.map(d => (
                    <tr key={d.name}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.name}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.date}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', ...getGradeStyle(d.grade) }}>{d.grade}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>x {d.coef}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot style={{ backgroundColor: '#f3f4f6', fontWeight: 'bold' }}>
                <tr>
                    <td colSpan={2} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Moyenne finale</td>
                    <td colSpan={2} style={{ padding: '8px', border: '1px solid #ddd', ...getGradeStyle(courseData.grade) }}>{courseData.grade}</td>
                </tr>
            </tfoot>
        </table>
      </>
    )
  }

  const renderBulletin = () => {
    const s1Courses = semesterResults.s1.courses;
    const s2Courses = semesterResults.s2.courses;
    
    let coursesToRender: (typeof s1Courses[0] & { semesterLabel: string })[] = [];
    if (semester === 's1') {
      coursesToRender = s1Courses.map(c => ({...c, semesterLabel: 'Semestre 1'}));
    } else if (semester === 's2') {
      coursesToRender = s2Courses.map(c => ({...c, semesterLabel: 'Semestre 2'}));
    } else { // annual
      coursesToRender = [
        ...s1Courses.map(c => ({...c, semesterLabel: 'Semestre 1'})),
        ...s2Courses.map(c => ({...c, semesterLabel: 'Semestre 2'})),
      ];
    }

    const groupedBySemester = coursesToRender.reduce((acc, course) => {
        (acc[course.semesterLabel] = acc[course.semesterLabel] || []).push(course);
        return acc;
    }, {} as Record<string, typeof coursesToRender>);


    return (
       <>
        {renderHeader()}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Semestre</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>UE</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Module</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Note</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Crédits validés</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedBySemester).map(([sem, courses]) => {
                const groupedByUe = groupCoursesByUE(courses);
                let semesterRowSpan = courses.length;

                return Object.entries(groupedByUe).map(([ue, ueCourses], ueIndex) => (
                    ueCourses.map((course, courseIndex) => (
                        <tr key={course.module}>
                          {ueIndex === 0 && courseIndex === 0 && <td rowSpan={semesterRowSpan} style={{ padding: '8px', border: '1px solid #ddd', verticalAlign: 'middle', textAlign: 'center', fontWeight: 'bold' }}>{sem}</td>}
                          {courseIndex === 0 && <td rowSpan={ueCourses.length} style={{ padding: '8px', border: '1px solid #ddd', verticalAlign: 'middle' }}>{ue}</td>}
                          <td style={{ padding: '8px', border: '1px solid #ddd' }}>{course.module}</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', ...getGradeStyle(course.grade) }}>{course.grade}</td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{course.creditsValidated}</td>
                        </tr>
                    ))
                ))
            })}
          </tbody>
          <tfoot style={{ backgroundColor: '#f3f4f6', fontWeight: 'bold' }}>
            {semester === 's1' && (
              <tr>
                <td colSpan={3} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total Semestre 1</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', ...getGradeStyle(semesterResults.s1.average) }}>{semesterResults.s1.average}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{semesterResults.s1.credits}</td>
              </tr>
            )}
            {semester === 's2' && (
              <tr>
                <td colSpan={3} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total Semestre 2</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', ...getGradeStyle(semesterResults.s2.average) }}>{semesterResults.s2.average}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{semesterResults.s2.credits}</td>
              </tr>
            )}
            {semester === 'annual' && (
              <tr>
                <td colSpan={3} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total Année</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', ...getGradeStyle(semesterResults.annual.average) }}>{semesterResults.annual.average}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{semesterResults.annual.credits}</td>
              </tr>
            )}
          </tfoot>
        </table>
        {semester === 'annual' && (
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', fontSize: '10px' }}>
                <h4 style={{fontWeight: 600, marginBottom: '5px'}}>Commentaires du jury</h4>
                <p style={{fontStyle: 'italic', margin: 0}}>{semesterResults.annual.juryComment}</p>
            </div>
        )}
      </>
    );
  };

  const groupCoursesByUE = (courses: any[]) => {
      return courses.reduce((acc, course) => {
          (acc[course.ue] = acc[course.ue] || []).push(course);
          return acc;
      }, {} as { [key: string]: any[] });
  };


  return (
    <div
      style={{
        width: '595px', // A4 width in pixels
        minHeight: '842px', // A4 height
        padding: '40px',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flexGrow: 1 }}>
        {displayType === 'course' ? renderCourseDetail() : renderBulletin()}
      </div>
      <footer style={{ marginTop: '30px', paddingTop: '10px', borderTop: '1px solid #ddd', fontSize: '9px', color: '#888', textAlign: 'center' }}>
        <p>Imprimé via UNI-VERX®</p>
      </footer>
    </div>
  );
}
