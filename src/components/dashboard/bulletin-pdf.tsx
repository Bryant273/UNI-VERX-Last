'use client';

import React from 'react';
import { studentData } from '@/lib/static-data';
import { semesterResults } from '@/lib/results-data';
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
  
  const s1Courses = semesterResults.s1.courses;
  const s2Courses = semesterResults.s2.courses;
  
  const groupCoursesByUE = (courses: any[]) => {
      return courses.reduce((acc, course) => {
          (acc[course.ue] = acc[course.ue] || []).push(course);
          return acc;
      }, {} as { [key: string]: any[] });
  };

  const s1Grouped = groupCoursesByUE(s1Courses);
  const s2Grouped = groupCoursesByUE(s2Courses);

  const renderHeader = () => (
    <div style={{ marginBottom: '1rem', border: '1px solid black' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
        <tbody>
          <tr>
            <td style={{ width: '20%', textAlign: 'center', padding: '1rem', borderRight: '1px solid black' }}>
              <div dangerouslySetInnerHTML={{ __html: getLogoSvg() }} style={{ width: '60px', height: '60px', margin: '0 auto' }} />
            </td>
            <td style={{ width: '40%', padding: '0.5rem', borderRight: '1px solid black' }}>
              <p><strong>Nom:</strong> {studentData.lastName}</p>
              <p><strong>Prénoms:</strong> {studentData.firstName}</p>
              <p><strong>Date & lieu de naissance:</strong> {studentData.birthDate} à {studentData.birthPlace}</p>
              <p><strong>Genre:</strong> {studentData.gender}</p>
            </td>
            <td style={{ width: '40%', padding: '0.5rem' }}>
              <p><strong>Année universitaire:</strong> {studentData.academicYear}</p>
              <h2 style={{ fontWeight: 'bold', fontSize: '12px', margin: '4px 0' }}>RELEVE DE NOTES</h2>
              <p><strong>Niveau:</strong> {studentData.level}</p>
              <p><strong>UFR:</strong> {studentData.ufr}</p>
              <p><strong>Spécialité:</strong> {studentData.speciality}</p>
              <p><strong>Matricule:</strong> {studentData.id}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderBody = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', border: '1px solid black' }}>
        <thead style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
            <tr>
                <th style={{ border: '1px solid black', padding: '4px', width: '5%' }}>SEMESTRE</th>
                <th style={{ border: '1px solid black', padding: '4px', width: '25%' }}>UE</th>
                <th style={{ border: '1px solid black', padding: '4px', width: '35%' }}>MODULE</th>
                <th style={{ border: '1px solid black', padding: '4px', width: '10%' }}>MOYENNE</th>
                <th style={{ border: '1px solid black', padding: '4px', width: '12%' }}>CREDITS A VALIDER</th>
                <th style={{ border: '1px solid black', padding: '4px', width: '13%' }}>CREDITS VALIDES</th>
            </tr>
        </thead>
        <tbody>
            {/* SEMESTRE 1 */}
            {Object.entries(s1Grouped).map(([ue, courses], ueIndex) => (
                courses.map((course, courseIndex) => (
                    <tr key={`s1-${course.module}`}>
                        {ueIndex === 0 && courseIndex === 0 && (
                            <td rowSpan={s1Courses.length} style={{ border: '1px solid black', textAlign: 'center', verticalAlign: 'middle' }}>
                                <div style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontWeight: 'bold' }}>SEMESTRE 1</div>
                            </td>
                        )}
                        {courseIndex === 0 && (
                            <td rowSpan={courses.length} style={{ border: '1px solid black', padding: '4px', verticalAlign: 'middle' }}>{ue}</td>
                        )}
                        <td style={{ border: '1px solid black', padding: '4px' }}>{course.module}</td>
                        <td style={{ border: '1px solid black', padding: '4px', ...getGradeStyle(course.grade) }}>{course.grade}</td>
                        <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>{course.creditsToValidate}</td>
                        <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>{course.creditsValidated}</td>
                    </tr>
                ))
            ))}

             {/* SEMESTRE 2 */}
             {Object.entries(s2Grouped).map(([ue, courses], ueIndex) => (
                courses.map((course, courseIndex) => (
                    <tr key={`s2-${course.module}`}>
                        {ueIndex === 0 && courseIndex === 0 && (
                            <td rowSpan={s2Courses.length} style={{ border: '1px solid black', textAlign: 'center', verticalAlign: 'middle' }}>
                                <div style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontWeight: 'bold' }}>SEMESTRE 2</div>
                            </td>
                        )}
                        {courseIndex === 0 && (
                            <td rowSpan={courses.length} style={{ border: '1px solid black', padding: '4px', verticalAlign: 'middle' }}>{ue}</td>
                        )}
                        <td style={{ border: '1px solid black', padding: '4px' }}>{course.module}</td>
                        <td style={{ border: '1px solid black', padding: '4px', ...getGradeStyle(course.grade) }}>{course.grade}</td>
                        <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>{course.creditsToValidate}</td>
                        <td style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>{course.creditsValidated}</td>
                    </tr>
                ))
            ))}
        </tbody>
    </table>
  );

  const renderFooter = () => (
    <div style={{ marginTop: '1rem', fontSize: '10px' }}>
      <div style={{ marginBottom: '4rem' }}>
        <strong>COMMENTAIRE :</strong> {semesterResults.annual.juryComment}
      </div>
      <div style={{ textAlign: 'right', marginRight: '4rem' }}>
        <strong>CACHET</strong>
      </div>
    </div>
  );


  return (
    <div
      style={{
        width: '8.27in', // A4 width
        minHeight: '11.69in', // A4 height
        padding: '0.5in',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </div>
  );
}
