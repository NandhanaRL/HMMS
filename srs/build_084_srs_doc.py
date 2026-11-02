"""
Complete Generator Script for A:\HMMS\srs\084 SRS Document.docx
Strictly matches A:\HMMS\srs\REFERENCE.pdf typography, structure, styling,
incorporating all 11 UML diagrams and Demonstration screenshot placeholders.
"""

import os
import sys
from PIL import Image
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.section import WD_SECTION
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

OUT_DOCX = r"A:\HMMS\srs\084 SRS Document.docx"
DIAGRAMS_DIR = r"A:\HMMS\diagrams"

def set_table_borders(table, color="000000", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def set_cell_margins(cell, top=60, bottom=60, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex="F0F0F0"):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def add_h1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_h2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_h3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(7)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_p(doc, text="", space_after=6, italic=False, bold=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if text:
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.font.italic = italic
        r.font.bold = bold
        r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_bullet(doc, text, bold_prefix="", space_after=3):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.left_indent = Inches(0.25)
    p.paragraph_format.first_line_indent = Inches(-0.15)
    
    r_bullet = p.add_run("\u2022  ")
    r_bullet.font.name = "Times New Roman"
    r_bullet.font.size = Pt(11)
    r_bullet.font.color.rgb = RGBColor(0, 0, 0)
    
    if bold_prefix:
        r_b = p.add_run(bold_prefix)
        r_b.font.name = "Times New Roman"
        r_b.font.size = Pt(12)
        r_b.font.bold = True
        r_b.font.color.rgb = RGBColor(0, 0, 0)
        
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_screenshot_box(doc, caption, height_in=2.7, placeholder_text="Screenshot to be attached"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.0)
    
    tr = tbl.rows[0]._tr
    trPr = tr.get_or_add_trPr()
    trHeight = parse_xml(f'<w:trHeight {nsdecls("w")} w:val="{int(height_in * 1440)}" w:hRule="exact"/>')
    trPr.append(trHeight)
    
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="8" w:space="0" w:color="999999"/>
            <w:left w:val="single" w:sz="8" w:space="0" w:color="999999"/>
            <w:bottom w:val="single" w:sz="8" w:space="0" w:color="999999"/>
            <w:right w:val="single" w:sz="8" w:space="0" w:color="999999"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8F9FA"/>')
    tcPr.append(shd)
    
    valign = parse_xml(f'<w:vAlign {nsdecls("w")} w:val="center"/>')
    tcPr.append(valign)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(45)
    p.paragraph_format.space_after = Pt(45)
    run = p.add_run(placeholder_text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)
    run.font.italic = True
    run.font.color.rgb = RGBColor(120, 120, 120)
    
    cap = doc.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap.paragraph_format.space_before = Pt(6)
    cap.paragraph_format.space_after = Pt(16)
    cap.paragraph_format.keep_with_next = True
    cap_run = cap.add_run(caption)
    cap_run.font.name = "Times New Roman"
    cap_run.font.size = Pt(14)
    cap_run.font.bold = True
    cap_run.font.color.rgb = RGBColor(0, 0, 0)

def main():
    print("Initializing document...")
    doc = Document()
    
    # Configure Normal Style
    style_normal = doc.styles['Normal']
    font_normal = style_normal.font
    font_normal.name = 'Times New Roman'
    font_normal.size = Pt(12)
    font_normal.color.rgb = RGBColor(0, 0, 0)
    
    # ----------------------------------------------------
    # SECTION 1: COVER PAGE
    # ----------------------------------------------------
    sec0 = doc.sections[0]
    sec0.different_first_page_header_footer = True
    sec0.top_margin = Inches(1.0)
    sec0.bottom_margin = Inches(1.0)
    sec0.left_margin = Inches(1.0)
    sec0.right_margin = Inches(1.0)
    
    # Top horizontal rule (3pt solid black rule matching reference)
    p_rule = doc.add_paragraph()
    p_rule.paragraph_format.space_before = Pt(0)
    p_rule.paragraph_format.space_after = Pt(30)
    pBdr = parse_xml(r'''
        <w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:bottom w:val="single" w:sz="24" w:space="1" w:color="000000"/>
        </w:pBdr>
    ''')
    p_rule._p.get_or_add_pPr().append(pBdr)
    
    # Right-aligned text block matching reference
    p_title1 = doc.add_paragraph()
    p_title1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_title1.paragraph_format.space_before = Pt(20)
    p_title1.paragraph_format.space_after = Pt(0)
    p_title1.paragraph_format.line_spacing = 1.05
    r = p_title1.add_run("Software Requirements\nSpecification")
    r.font.name = "Times New Roman"
    r.font.size = Pt(24)
    r.font.bold = True
    
    p_for = doc.add_paragraph()
    p_for.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_for.paragraph_format.space_before = Pt(16)
    p_for.paragraph_format.space_after = Pt(16)
    r = p_for.add_run("for")
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    
    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_proj.paragraph_format.space_before = Pt(0)
    p_proj.paragraph_format.space_after = Pt(80)
    p_proj.paragraph_format.line_spacing = 1.05
    r = p_proj.add_run("Hostel & Mess Management System\n(HMMS)")
    r.font.name = "Times New Roman"
    r.font.size = Pt(20)
    r.font.bold = True
    
    cover_meta = [
        "Version 1.0 approved",
        "Prepared by Giridhar A (Roll No. 084)",
        "Coimbatore Institute of Technology",
        "September 2026"
    ]
    for line in cover_meta:
        p_m = doc.add_paragraph()
        p_m.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_m.paragraph_format.space_before = Pt(4)
        p_m.paragraph_format.space_after = Pt(16)
        r = p_m.add_run(line)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.font.bold = True

    # ----------------------------------------------------
    # SECTION 2: PRELIMS (TABLE OF CONTENTS & REVISION HISTORY)
    # Designed to fit crisply on Page 2 (Roman numeral ii)
    # ----------------------------------------------------
    # SECTION 2: PRELIMS (TABLE OF CONTENTS & REVISION HISTORY)
    # Designed to fit crisply on Page 2 (Roman numeral ii)
    # ----------------------------------------------------
    sec_prelim = doc.add_section(WD_SECTION.NEW_PAGE)
    sec_prelim.header.is_linked_to_previous = False
    sec_prelim.top_margin = Inches(0.5)
    sec_prelim.bottom_margin = Inches(0.5)
    sec_prelim.left_margin = Inches(1.0)
    sec_prelim.right_margin = Inches(1.0)
    
    hdr_prelim = sec_prelim.header.paragraphs[0]
    hdr_prelim.paragraph_format.tab_stops.add_tab_stop(Inches(6.5), WD_TAB_ALIGNMENT.RIGHT)
    r_hdr1 = hdr_prelim.add_run("Software Requirements Specification for Hostel & Mess Management System (HMMS)\t")
    r_hdr1.font.name = "Times New Roman"
    r_hdr1.font.size = Pt(10)
    r_hdr1.font.italic = True
    r_hdr2 = hdr_prelim.add_run("Page ii")
    r_hdr2.font.name = "Times New Roman"
    r_hdr2.font.size = Pt(10)
    r_hdr2.font.italic = True
    r_hdr2.font.bold = True

    # Table of Contents Heading
    p_toc_head = doc.add_paragraph()
    p_toc_head.paragraph_format.space_before = Pt(0)
    p_toc_head.paragraph_format.space_after = Pt(3)
    r = p_toc_head.add_run("Table of Contents")
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    
    # Table of Contents Entries matching REFERENCE.pdf Page 2 exactly
    toc_items = [
        ("Table of Contents", "ii", True, 0),
        ("Revision History", "ii", True, 0),
        ("1.  Introduction", "1", True, 0),
        ("1.1  Purpose", "1", False, 1),
        ("1.2  Document Conventions", "1", False, 1),
        ("1.3  Intended Audience and Reading Suggestions", "2", False, 1),
        ("1.4  Product Scope", "2", False, 1),
        ("1.5  References", "3", False, 1),
        ("2.  Overall Description", "3", True, 0),
        ("2.1  Product Perspective", "3", False, 1),
        ("2.2  Product Functions", "4", False, 1),
        ("2.3  User Classes and Characteristics", "4", False, 1),
        ("2.4  Operating Environment", "5", False, 1),
        ("2.5  Design and Implementation Constraints", "6", False, 1),
        ("2.6  User Documentation", "6", False, 1),
        ("2.7  Assumptions and Dependencies", "6", False, 1),
        ("3.  External Interface Requirements", "7", True, 0),
        ("3.1  User Interfaces", "7", False, 1),
        ("3.2  Hardware Interfaces", "7", False, 1),
        ("3.3  Software Interfaces", "8", False, 1),
        ("3.4  Communications Interfaces", "8", False, 1),
        ("4.  System Features", "8", True, 0),
        ("4.1  User Authentication and Access Control", "8", False, 1),
        ("4.2  Student Resident Onboarding and Profiling", "9", False, 1),
        ("4.3  Room Inventory and Occupancy Allocation", "10", False, 1),
        ("4.4  Multi-Session Daily Attendance Tracking", "10", False, 1),
        ("4.5  Digital Leave Application and Warden Approval", "11", False, 1),
        ("4.6  Fee Ledger, Billing Reports, and Arrears Audit", "12", False, 1),
        ("4.7  Facility Maintenance and Grievance Ticketing", "13", False, 1),
        ("4.8  Mess Dining Menu and Catering Operations", "13", False, 1),
        ("4.9  Supervisory Staff Provisioning & Governance", "14", False, 1),
        ("5.  Other Nonfunctional Requirements", "14", True, 0),
        ("5.1  Performance Requirements", "14", False, 1),
        ("5.2  Safety Requirements", "14", False, 1),
        ("5.3  Security Requirements", "14", False, 1),
        ("5.4  Software Quality Attributes", "15", False, 1),
        ("5.5  Business Rules", "15", False, 1),
        ("6.  Other Requirements", "16", True, 0),
        ("Appendix : Analysis Of Models", "19", True, 0),
        ("Demonstration", "30", True, 0)
    ]
    
    for title, page_str, is_bold, indent_level in toc_items:
        p_toc = doc.add_paragraph()
        p_toc.paragraph_format.tab_stops.add_tab_stop(Inches(6.5), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
        p_toc.paragraph_format.space_before = Pt(0)
        p_toc.paragraph_format.space_after = Pt(0)
        p_toc.paragraph_format.line_spacing = Pt(10.2)
        if indent_level > 0:
            p_toc.paragraph_format.left_indent = Inches(0.2 * indent_level)
            
        r_t = p_toc.add_run(f"{title}\t")
        r_t.font.name = "Times New Roman"
        r_t.font.size = Pt(8.8)
        r_t.font.bold = is_bold
        
        r_p = p_toc.add_run(page_str)
        r_p.font.name = "Times New Roman"
        r_p.font.size = Pt(8.8)
        r_p.font.bold = is_bold

    # Revision History Heading (on the same page below TOC)
    p_rev = doc.add_paragraph()
    p_rev.paragraph_format.space_before = Pt(5)
    p_rev.paragraph_format.space_after = Pt(2)
    r = p_rev.add_run("Revision History")
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    
    # Revision History Table
    table_rev = doc.add_table(rows=5, cols=4)
    table_rev.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_rev.autofit = False
    set_table_borders(table_rev)
    
    col_widths = [Inches(1.5), Inches(1.0), Inches(3.2), Inches(0.8)]
    for row in table_rev.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width
            set_cell_margins(row.cells[idx], top=25, bottom=25, left=50, right=50)
            
    headers = ["Name", "Date", "Reason For Changes", "Version"]
    for idx, text in enumerate(headers):
        cell = table_rev.rows[0].cells[idx]
        set_cell_shading(cell, "F0F0F0")
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = Pt(9.5)
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(8.5)
        r.font.bold = True
        
    rev_data = [
        ("Engineering Design Team", "09/10/2026", "Initial System Inception & Requirements Elicitation", "0.1"),
        ("Architecture Review Board", "09/15/2026", "Refinement of Relational Schemas & RBAC", "0.5"),
        ("Full-Stack Implementation Lead", "09/22/2026", "Alignment with Production React/Node.js/MySQL", "0.9"),
        ("System Architecture Board", "09/29/2026", "Final Specification Review & Release Approval", "1.0 Approved")
    ]
    for row_idx, data in enumerate(rev_data, start=1):
        for col_idx, text in enumerate(data):
            cell = table_rev.rows[row_idx].cells[col_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = Pt(9.0)
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(text)
            r.font.name = "Times New Roman"
            r.font.size = Pt(8.0)

    # ----------------------------------------------------
    # SECTION 3: MAIN BODY (SECTIONS 1 TO 6)
    # Starts on Page 3, labeled "Page 1"
    # ----------------------------------------------------
    sec_body = doc.add_section(WD_SECTION.NEW_PAGE)
    sec_body.header.is_linked_to_previous = False
    sec_body.top_margin = Inches(1.0)
    sec_body.bottom_margin = Inches(1.0)
    sec_body.left_margin = Inches(1.0)
    sec_body.right_margin = Inches(1.0)
    
    # Restart page numbering at 1 for main body
    pgNumType = parse_xml(r'<w:pgNumType %s w:start="1"/>' % nsdecls('w'))
    sec_body._sectPr.append(pgNumType)
    
    hdr_body = sec_body.header.paragraphs[0]
    hdr_body.paragraph_format.tab_stops.add_tab_stop(Inches(6.5), WD_TAB_ALIGNMENT.RIGHT)
    r1 = hdr_body.add_run("Software Requirements Specification for Hostel & Mess Management System (HMMS)\t")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(10)
    r1.font.italic = True
    r2 = hdr_body.add_run("Page ")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(10)
    r2.font.italic = True
    r2.font.bold = True
    
    # Dynamic PAGE field in header
    fldSimple = parse_xml(r'''
        <w:fldSimple %s w:instr="PAGE">
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:b/>
                    <w:i/>
                    <w:sz w:val="20"/>
                </w:rPr>
                <w:t>1</w:t>
            </w:r>
        </w:fldSimple>
    ''' % nsdecls('w'))
    hdr_body._p.append(fldSimple)

    # ==================== 1. INTRODUCTION ====================
    add_h1(doc, "1. Introduction")
    
    add_h2(doc, "1.1 Purpose")
    add_p(doc, "The purpose of this Software Requirements Specification (SRS) document is to provide a complete, rigorous, and unambiguous description of the software requirements for the Hostel & Mess Management System (HMMS), Version 1.0. This specification outlines the functional capabilities, performance criteria, user interactions, external interfaces, database architectures, and design constraints that govern the design, implementation, and deployment of HMMS.")
    add_p(doc, "This document encompasses the entire full-stack software system, including the clientside Single Page Application (SPA), the serverside Representational State Transfer (REST) Application Programming Interface (API), the relational database layer, and all supporting authentication and operational subsystems. It serves as the primary contractual and technical baseline for software developers, system architects, quality assurance engineers, institutional stakeholders, and project supervisors.")

    add_h2(doc, "1.2 Document Conventions")
    add_p(doc, "This document uses the following conventions", italic=True)
    
    # Document conventions table matching reference layout
    table_conv = doc.add_table(rows=13, cols=2)
    table_conv.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_conv.autofit = False
    set_table_borders(table_conv)
    
    conv_widths = [Inches(1.8), Inches(4.7)]
    for row in table_conv.rows:
        for idx, width in enumerate(conv_widths):
            row.cells[idx].width = width
            set_cell_margins(row.cells[idx], top=60, bottom=60, left=100, right=100)
            
    c_headers = ["Term / Acronym", "Definition / Standard Meaning"]
    for idx, text in enumerate(c_headers):
        cell = table_conv.rows[0].cells[idx]
        set_cell_shading(cell, "F0F0F0")
        p = cell.paragraphs[0]
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        
    conventions_data = [
        ("HMMS", "Hostel & Mess Management System"),
        ("IEEE", "Institute of Electrical and Electronics Engineers"),
        ("SRS", "Software Requirements Specification"),
        ("REST", "Representational State Transfer"),
        ("API", "Application Programming Interface"),
        ("JWT", "JSON Web Token (RFC 7519)"),
        ("RBAC", "Role-Based Access Control"),
        ("SPA", "Single Page Application"),
        ("SQL", "Structured Query Language"),
        ("ACID", "Atomicity, Consistency, Isolation, Durability"),
        ("UI / UX", "User Interface / User Experience"),
        ("CORS", "Cross-Origin Resource Sharing")
    ]
    for row_idx, (term, defn) in enumerate(conventions_data, start=1):
        c0 = table_conv.rows[row_idx].cells[0]
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(term)
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(10)
        r0.font.bold = True
        
        c1 = table_conv.rows[row_idx].cells[1]
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(defn)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(10)

    add_p(doc, "", space_after=6)
    add_h2(doc, "1.3 Intended Audience and Reading Suggestions")
    add_p(doc, "This document is targeted toward multiple categories of readers, each of whom should navigate the contents according to their technical objectives:")
    add_bullet(doc, "Sections 1 (Introduction), 2 (Overall Description), and Appendix (Analysis of Models) provide an executive overview of the system's operational scope, institutional feasibility, and architectural rigor.", bold_prefix="Project Stakeholders and Technical Evaluators: ")
    add_bullet(doc, "Sections 3 (External Interface Requirements), 4 (System Features), and 6.1 (Conceptual Data Model) establish the definitive behavioral contract, input-processing-output criteria, error conditions, and database structures required for code generation and maintenance.", bold_prefix="Software Developers and Full-Stack Engineers: ")
    add_bullet(doc, "Section 4 (System Features) and Section 5 (Other Nonfunctional Requirements) formulate the verification matrix, boundary conditions, exception rules, and performance thresholds against which unit, integration, and end-to-end test suites are validated.", bold_prefix="Quality Assurance and Test Automation Engineers: ")
    add_bullet(doc, "Section 2.2 (Product Functions), Section 2.3 (User Classes), and Section 5.5 (Business Rules) outline operational policies, permissions models, and institutional workflows enforced by the platform.", bold_prefix="Institutional Administrators and Facility Wardens: ")

    add_h2(doc, "1.4 Product Scope")
    add_p(doc, "The Hostel & Mess Management System (HMMS) is an integrated enterprise-grade management portal engineered to digitize, unify, and automate residential campus governance in higher education institutions. Historically, university hostels have relied on fragmented paper registers, physical ledgers, verbal notifications, and manual sign-in sheets. This legacy approach is prone to clerical errors, unauthorized out-passes, unaccounted meal waste, delayed maintenance responses, and financial reconciliation discrepancies.")
    add_p(doc, "HMMS delivers a unified, centralized web platform engineered on modern client-server principles. The system orchestrates four key administrative domains:")
    add_bullet(doc, "Enabling self-service visibility into room assignment, meal attendance metrics, semester dues, digital out-pass leave requests, and maintenance complaint tickets.", bold_prefix="1. Student Residential Life: ")
    add_bullet(doc, "Providing automated physical occupancy rosters, real-time bed allocation toggles, digital leave request evaluation, room inspection logging, and roll-call records.", bold_prefix="2. Warden Residential Supervision: ")
    add_bullet(doc, "Managing daily dining menus across four meal tiers (Breakfast, Lunch, Snacks, Dinner), recording student dining check-ins, monitoring turnout, and auditing resident meal fee collections.", bold_prefix="3. Mess and Dining Operations: ")
    add_bullet(doc, "Centralizing role-based provisioning of wardens, mess managers, and student residents, maintaining hostel building and room master inventories, and generating institutional audit reports.", bold_prefix="4. System Administration: ")
    add_p(doc, "By deploying HMMS, the institution eliminates manual paperwork, enforces strict campus security and accountability, ensures equitable hostel resource allocation, eliminates food waste through meal demand predictability, and maintains transparent financial audit trails.")

    add_h2(doc, "1.5 References")
    add_bullet(doc, "IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications, IEEE Computer Society, 1998.")
    add_bullet(doc, "Fielding, R. T., Architectural Styles and the Design of Network-based Software Architectures, Doctoral Dissertation, University of California, Irvine, 2000.")
    add_bullet(doc, "Internet Engineering Task Force (IETF) RFC 7519, JSON Web Token (JWT), May 2015.")
    add_bullet(doc, "World Wide Web Consortium (W3C), Web Content Accessibility Guidelines (WCAG) 2.1, June 2018.")
    add_bullet(doc, "Elmasri, R., and Navathe, S. B., Fundamentals of Database Systems, 7th Edition, Pearson, 2016.")
    add_bullet(doc, "React Documentation, React: The Library for Web and Native User Interfaces, Meta Platforms, Inc., 2024.")
    add_bullet(doc, "Node.js Foundation, Node.js Technical Documentation and Architecture, OpenJS Foundation, 2024.")

    # ==================== 2. OVERALL DESCRIPTION ====================
    add_h1(doc, "2. Overall Description")
    
    add_h2(doc, "2.1 Product Perspective")
    add_p(doc, "HMMS is an autonomous, self-contained, web-based software application engineered to replace manual hostel record books and ad-hoc spreadsheets. While operating as a complete standalone system, HMMS is structurally designed following a layered, decoupled Client-Server architecture that integrates with existing institutional local area networks (LAN) or public cloud infrastructure.")
    add_p(doc, "The three primary architectural tiers include:")
    add_bullet(doc, "React 18 Single Page Application (Vite Build Engine + Tailwind CSS) providing responsive interfaces across desktop, tablet, and mobile devices with Axios HTTP interceptor pipelines for token handling.", bold_prefix="Client Tier: ")
    add_bullet(doc, "Node.js and Express.js asynchronous runtime environment providing stateless REST API routers, role-based access control middleware, input validation, and business logic controllers.", bold_prefix="Application Tier: ")
    add_bullet(doc, "MySQL 8.0 Enterprise Relational Database Management System providing connection pooling, ACID transaction semantics, referential integrity via foreign key constraints, and 3NF normalized schemas.", bold_prefix="Data Tier: ")

    add_h2(doc, "2.2 Product Functions")
    add_p(doc, "The primary functions executed by the HMMS software ecosystem are categorized across six principal operational pillars:")
    add_bullet(doc, "Secure cryptographically salted credential authentication via JSON Web Tokens (JWT) partitioned across four distinct authorization levels with client-side route guarding.", bold_prefix="1. User Identity & Access Management: ")
    add_bullet(doc, "Building, wing, and room master catalogue tracking room types (Single, Double, Triple), operational status, maximum bed capacities, and real-time warden allocation assignment.", bold_prefix="2. Residential Inventory & Bed Allocation: ")
    add_bullet(doc, "Three-tier meal session recording (Breakfast, Lunch, Dinner) as well as daily hostel night roll-call tracking with interactive check-in rosters supporting bulk toggles and 75% residency compliance calculation.", bold_prefix="3. Multi-Session Campus & Dining Attendance: ")
    add_bullet(doc, "Self-service digital out-pass filing for overnight campus departures with destination, emergency contact, and duration timestamps, paired with supervisory Warden approval/rejection queues.", bold_prefix="4. Residential Leave & Out-Pass Governance: ")
    add_bullet(doc, "Automated ledger creation calculating assessed fees, recorded student settlements, and outstanding balances across room occupancy, mess subscriptions, and campus maintenance dues.", bold_prefix="5. Institutional Billing & Arrears Audit: ")
    add_bullet(doc, "Student issue reporting categorized under structural room maintenance, electrical fixtures, plumbing, mess quality, or general campus inquiries with administrative resolution logging.", bold_prefix="6. Campus Maintenance & Grievance Rectification: ")

    add_h2(doc, "2.3 User Classes and Characteristics")
    add_p(doc, "The platform serves four primary user classes with distinct operational responsibilities, educational backgrounds, and system interaction profiles:")
    
    table_users = doc.add_table(rows=5, cols=4)
    table_users.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_users.autofit = False
    set_table_borders(table_users)
    
    u_widths = [Inches(1.4), Inches(1.3), Inches(1.2), Inches(2.6)]
    for row in table_users.rows:
        for idx, width in enumerate(u_widths):
            row.cells[idx].width = width
            set_cell_margins(row.cells[idx], top=60, bottom=60, left=100, right=100)
            
    u_headers = ["User Class", "Technical Expertise", "Usage Frequency", "Primary System Objectives"]
    for idx, text in enumerate(u_headers):
        cell = table_users.rows[0].cells[idx]
        set_cell_shading(cell, "F0F0F0")
        p = cell.paragraphs[0]
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)
        r.font.bold = True
        
    users_data = [
        ("Student Resident", "Moderate to High", "Daily (multiple times)", "Review meal menus, monitor attendance compliance, check room allocation, submit leave out-passes, verify payment dues, log facility maintenance tickets."),
        ("Hostel Warden", "Moderate", "Daily (work shifts)", "Supervise wing occupancy, execute bed allocations, review and approve/reject leave applications, conduct night roll-calls, investigate complaints, audit fee ledgers."),
        ("Mess Manager", "Basic to Moderate", "Daily (meal schedules)", "Manage published daily meal menus, execute resident check-ins for breakfast, lunch, and dinner, monitor dietary preferences, audit dining fee reports."),
        ("System Administrator", "High", "Weekly to Monthly", "Provision supervisor accounts (Wardens, Mess Managers), manage campus room master inventories, oversee student resident admissions, ensure database integrity.")
    ]
    for row_idx, data in enumerate(users_data, start=1):
        for col_idx, text in enumerate(data):
            cell = table_users.rows[row_idx].cells[col_idx]
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.name = "Times New Roman"
            r.font.size = Pt(10)
            if col_idx == 0:
                r.font.bold = True

    add_p(doc, "", space_after=6)
    add_h2(doc, "2.4 Operating Environment")
    add_h3(doc, "Client-Side Environment")
    add_bullet(doc, "Google Chrome 90+, Mozilla Firefox 88+, Apple Safari 14+, Microsoft Edge 90+, Opera 76+.", bold_prefix="Browser Compatibility: ")
    add_bullet(doc, "Responsive layout support across Smartphones (min width 360px), Tablets (768px - 1024px), Laptops (1280px - 1440px), and Ultra-wide Desktop Monitors (1920px+).", bold_prefix="Device Support: ")
    add_bullet(doc, "ECMAScript 2020 (ES11) compliant JavaScript runtime.", bold_prefix="Client Execution Engine: ")
    
    add_h3(doc, "Server-Side Environment")
    add_bullet(doc, "Node.js version 18.x LTS or 20.x LTS.", bold_prefix="Runtime Environment: ")
    add_bullet(doc, "Platform independent; verified on Ubuntu Linux 22.04 LTS, Debian 12, Red Hat Enterprise Linux 9, Windows Server 2022, and Windows 10/11 Professional.", bold_prefix="Operating System: ")
    add_bullet(doc, "Express.js native HTTP server, optionally fronted by NGINX or Apache HTTP Server for SSL termination and static asset caching.", bold_prefix="Web Server / Reverse Proxy: ")
    
    add_h3(doc, "Database Environment")
    add_bullet(doc, "MySQL Enterprise Server 8.0 or MariaDB 10.6+.", bold_prefix="Database Engine: ")
    add_bullet(doc, "InnoDB supporting ACID transactions, row-level locking, and foreign key constraints.", bold_prefix="Storage Engine: ")
    add_bullet(doc, "utf8mb4 with utf8mb4_unicode_ci collation supporting internationalized names and full Unicode glyph sets.", bold_prefix="Character Encoding: ")

    add_h2(doc, "2.5 Design and Implementation Constraints")
    add_bullet(doc, "The frontend SPA and backend REST API must communicate strictly through stateless JSON payloads over HTTP/HTTPS. No serverside HTML rendering or session state storage is permitted in the Express runtime.", bold_prefix="1. Architectural Decoupling: ")
    add_bullet(doc, "User identity must be authenticated via digitally signed JSON Web Tokens (JWT) adhering to RFC 7519. Secret keys must be managed through secure environment variables (.env) and never checked into source control.", bold_prefix="2. Stateless Authentication: ")
    add_bullet(doc, "All relational schemas must adhere to Third Normal Form (3NF) to eliminate data redundancy, anomalous deletions, and update discrepancies.", bold_prefix="3. Database Normalization: ")
    add_bullet(doc, "Frontend user interfaces must utilize pure Tailwind CSS utility classes and modern vanilla CSS tokens. Bulky third-party UI component suites that inflate bundle sizes or introduce rigid legacy styles are strictly avoided.", bold_prefix="4. CSS and UI Framework Constraints: ")
    add_bullet(doc, "Student personal records, guardian contact telephone numbers, and financial payment histories must be protected with access controls preventing cross-student data leakage.", bold_prefix="5. Regulatory & Privacy Compliance: ")

    add_h2(doc, "2.6 User Documentation")
    add_p(doc, "HMMS includes a comprehensive documentation suite delivered alongside the system distribution:")
    add_bullet(doc, "Technical instructions detailing MySQL database creation, .env parameter configuration, npm package provisioning, database migration scripts, and production process management via PM2.", bold_prefix="System Administrator Installation & Setup Manual: ")
    add_bullet(doc, "Illustrated task-oriented walkthroughs covering room allocation, multi-session meal check-in, out-pass verification, and billing report extraction.", bold_prefix="Warden & Mess Manager Operational Guide: ")
    add_bullet(doc, "Accessible online portal documentation explaining leave filing timelines, minimum attendance thresholds, grievance submission procedures, and account security.", bold_prefix="Student Resident Digital Portal Guide: ")
    add_bullet(doc, "Formal OpenAPI/Swagger specification detailing all JSON payload schemas, authorization headers, HTTP response status codes, and error models.", bold_prefix="Interactive REST API Documentation: ")

    add_h2(doc, "2.7 Assumptions and Dependencies")
    add_bullet(doc, "It is assumed that students, wardens, and mess supervisors have access to campus Wi-Fi, LAN, or cellular mobile networks to access the web application.", bold_prefix="Campus Network Connectivity: ")
    add_bullet(doc, "It is assumed that wardens and mess managers possess desktop computers, laptops, or tablets capable of rendering modern HTML5/CSS3 web browsers.", bold_prefix="Device Availability: ")
    add_bullet(doc, "It is assumed that initial student academic admissions records (Roll Numbers, Departments, Assigned Academic Years) are provisioned through verified institutional enrolment records.", bold_prefix="Institutional Master Data: ")
    add_bullet(doc, "The system depends on a continuous, uninterrupted connection to the MySQL database engine. Database clustering or localized automatic restarts must maintain high availability.", bold_prefix="Database Persistence: ")

    # ==================== 3. EXTERNAL INTERFACE REQUIREMENTS ====================
    add_h1(doc, "3. External Interface Requirements")
    
    add_h2(doc, "3.1 User Interfaces")
    add_p(doc, "The HMMS user interface is engineered according to commercial SaaS product design standards, prioritizing visual ergonomics, disciplined spacing, and accessibility.")
    add_h3(doc, "Visual Design System")
    add_bullet(doc, "Deep Obsidian Blue (#060C1B) for application canvas, Slate Midnight (#0F172A) for navigation sidebars, Card Charcoal (#111827) for cards, Elevated Navy (#1A2338) for secondary surfaces, Royal Blue (#2563EB) for brand accents, Success Emerald (#16A34A), Warning Amber (#D97706), and Danger Crimson (#DC2626) for semantic badges.", bold_prefix="Color Palette: ")
    add_bullet(doc, "Inter typography font family applied globally; Page Titles at 42px Bold, Section Titles at 24px SemiBold, Statistical Metric Values at 32px Bold, Table Headers & Body at 15px Medium/Regular, and Secondary Badges at 13px Regular.", bold_prefix="Typographic Scale: ")
    add_bullet(doc, "Rigid 8px dimensional grid enforcing 24px card paddings (p-6), 32px major section gaps (space-y-8), 16px grid card gutters (gap-4/gap-6), and 40–44px uniform button heights.", bold_prefix="Spatial System: ")

    add_h3(doc, "Layout Blueprints")
    add_p(doc, "Every role-based portal implements a persistent, fixed-width sidebar (w-64) with rounded geometry, soft elevation shadows, aligned Lucide icons, and a filled blue active pill indicator. The top header provides persistent breadcrumbs, user identification avatars with initial-based fallbacks, and notification triggers. Tables feature sticky column headers, rounded outer containers, and soft row hover transitions.")

    add_h2(doc, "3.2 Hardware Interfaces")
    add_bullet(doc, "Standard personal computing devices equipped with minimum 2 GB RAM, dual-core processors, and display monitors with minimum resolution of 360 x 640 pixels (mobile) or 1366 x 768 pixels (workstation).", bold_prefix="Client Processing Hardware: ")
    add_bullet(doc, "Host computing server equipped with minimum 2 vCPUs, 4 GB RAM, and 20 GB solid-state disk (SSD) storage running standard server operating systems.", bold_prefix="Server Infrastructure: ")

    add_h2(doc, "3.3 Software Interfaces")
    add_bullet(doc, "Node.js system runtime accessing filesystem directories for log output, environment configuration files (.env), and process signal monitoring (SIGINT, SIGTERM).", bold_prefix="Operating System Interfaces: ")
    add_bullet(doc, "Communicates with MySQL 8.0 via the mysql2/promise driver over standard TCP/IP socket connections utilizing connection pooling (maximum 10 concurrent connections per node process).", bold_prefix="Database Engine Management: ")
    add_bullet(doc, "Frontend Axios client library configured with dynamic environment-driven base URLs and asynchronous request/response interceptors that inject Bearer JWT authorization headers into outgoing requests.", bold_prefix="HTTP Client Communication: ")
    add_bullet(doc, "Lucide React modern vector icon package for consistent, responsive SVG vector graphics rendering across all viewports.", bold_prefix="Component Iconography: ")

    add_h2(doc, "3.4 Communications Interfaces")
    add_bullet(doc, "Hypertext Transfer Protocol Secure (HTTPS) over Transport Layer Security (TLS 1.2 or TLS 1.3) for all production traffic; HTTP/1.1 permitted during local development.", bold_prefix="Transport Layer Protocol: ")
    add_bullet(doc, "JavaScript Object Notation (JSON) format adhering to MIME type application/json for all API request bodies and response payloads.", bold_prefix="Data Serialization: ")
    add_bullet(doc, "Backend Express CORS middleware configured to validate and permit trusted origins (including localhost, institutional domain, and cloud hosting URLs) with credentials enabled, preventing cross-site scripting and unauthorized domain access.", bold_prefix="Cross-Origin Resource Sharing (CORS): ")

    # ==================== 4. SYSTEM FEATURES ====================
    add_h1(doc, "4. System Features")

    # Feature 4.1
    add_h2(doc, "4.1 User Authentication and Access Control")
    add_h3(doc, "4.1.1 Description and Priority")
    add_p(doc, "HMMS mandates secure credential authentication for all system actors. The system implements stateless, role-partitioned authentication utilizing JSON Web Tokens.\nPriority: High (Core Security Foundation).")
    add_h3(doc, "4.1.2 Stimulus/Response Sequences")
    add_bullet(doc, "The user navigates to /login, selects their operational portal tab (Student, Warden, Mess Manager, or Admin), enters their registered email address and password, and clicks 'Authenticate Portal'.", bold_prefix="User Action: ")
    add_bullet(doc, "The clientside application validates input completeness and dispatches an HTTP POST request to /api/auth/login.", bold_prefix="System Response: ")
    add_bullet(doc, "The server validates the existence of the email, verifies the password hash, asserts that the user's role matches the requested portal, generates an encrypted JWT token, and returns user identity metadata.", bold_prefix="Backend Processing: ")
    add_bullet(doc, "The client stores the JWT in persistent storage, updates the global AuthContext state, and navigates the user to their designated dashboard.", bold_prefix="Client Ingestion: ")
    add_h3(doc, "4.1.3 Functional Requirements")
    add_bullet(doc, "The system shall authenticate users against the USER relational table via verified email address and cryptographic password match.", bold_prefix="REQ-AUTH-01: ")
    add_bullet(doc, "Upon successful verification, the system shall generate a cryptographically signed JSON Web Token containing user_id, email, and role, signed with an HMAC-SHA256 secret key, configured with an expiration period of 24 hours.", bold_prefix="REQ-AUTH-02: ")
    add_bullet(doc, "The system shall reject login attempts where the authenticated user role does not match the active login portal selection.", bold_prefix="REQ-AUTH-03: ")
    add_bullet(doc, "The frontend application shall intercept all protected route transitions and redirect unauthenticated or unauthorized requests to /login.", bold_prefix="REQ-AUTH-04: ")
    add_bullet(doc, "The frontend Axios interceptor shall automatically attach the authorization header 'Authorization: Bearer <token>' to all HTTP requests directed to /api/*.", bold_prefix="REQ-AUTH-05: ")

    # Feature 4.2
    add_h2(doc, "4.2 Student Resident Onboarding and Profiling")
    add_h3(doc, "4.2.1 Description and Priority")
    add_p(doc, "Allows Administrators to register new student hostel residents, provision access credentials, and maintain academic directory profiles.\nPriority: High.")
    add_h3(doc, "4.2.2 Stimulus/Response Sequences")
    add_bullet(doc, "Admin opens the Student Roster portal (/admin/students), expands the 'Enrol New Student' form, fills in student demographic details (Name, Email, Password, Roll Number, Phone, Department, Year of Study, Guardian Contact), and submits.", bold_prefix="User Action: ")
    add_bullet(doc, "Form inputs are verified; POST request dispatches to /api/admin/students.", bold_prefix="System Response: ")
    add_bullet(doc, "System executes an atomic transaction creating the base USER record with role 'STUDENT', retrieves the inserted user_id, and creates the associated STUDENT record with roll number and academic parameters.", bold_prefix="Backend Processing: ")
    add_bullet(doc, "System alerts success and triggers an automatic roster re-fetch.", bold_prefix="System Response: ")
    add_h3(doc, "4.2.3 Functional Requirements")
    add_bullet(doc, "The system shall enforce uniqueness on student roll numbers and institutional email addresses.", bold_prefix="REQ-STU-01: ")
    add_bullet(doc, "The system shall store academic details including Department and Year of Study (1 through 4).", bold_prefix="REQ-STU-02: ")
    add_bullet(doc, "The system shall record student contact phone numbers and mandatory emergency guardian contact numbers.", bold_prefix="REQ-STU-03: ")
    add_bullet(doc, "Deletion of a student record shall cascade appropriately, clearing active room allocations while archiving past financial transaction records.", bold_prefix="REQ-STU-04: ")

    # Feature 4.3
    add_h2(doc, "4.3 Room Inventory and Occupancy Allocation")
    add_h3(doc, "4.3.1 Description and Priority")
    add_p(doc, "Enables the administration to provision physical hostel rooms, define occupancy capacities, track vacancies, and empowers Wardens to allocate residents to beds.\nPriority: High.")
    add_h3(doc, "4.3.2 Stimulus/Response Sequences")
    add_bullet(doc, "Admin inputs Room Number, Room Tier (Single, Double, Triple), and Capacity (1 to 6) on /admin/rooms. System inserts record into ROOM with initial occupied_count = 0 and status AVAILABLE.", bold_prefix="Room Creation: ")
    add_bullet(doc, "Warden views active room cards on /warden/rooms. The card displays occupancy progress (e.g., '1 of 2 Beds Filled'). The Warden selects an unallocated resident from the dropdown and clicks 'Allocate Student'.", bold_prefix="Room Allocation: ")
    add_bullet(doc, "System verifies that occupied_count < capacity. It updates the student's room_id in the database, increments the room's occupied_count, and if occupied_count == capacity, sets room status to FULL.", bold_prefix="Processing: ")
    add_bullet(doc, "When the student resident logs into their portal (/student/room), the system renders their assigned room number, block wing, room type, and occupancy status.", bold_prefix="Student Feedback: ")
    add_h3(doc, "4.3.3 Functional Requirements")
    add_bullet(doc, "The system shall track room inventory with unique room identifiers, room numbers, types (Single, Double, Triple), capacities, and statuses (Available, Full).", bold_prefix="REQ-ROOM-01: ")
    add_bullet(doc, "The system shall prohibit the allocation of any student to a room whose occupied_count is equal to or exceeds its designated capacity.", bold_prefix="REQ-ROOM-02: ")
    add_bullet(doc, "The system shall automatically compute room occupancy percentage and visually display dynamic gauge indicators.", bold_prefix="REQ-ROOM-03: ")
    add_bullet(doc, "Wardens shall have manual toggle overrides to mark a room as Available or Full during maintenance closures.", bold_prefix="REQ-ROOM-04: ")

    # Feature 4.4
    add_h2(doc, "4.4 Multi-Session Daily Attendance Tracking")
    add_h3(doc, "4.4.1 Description and Priority")
    add_p(doc, "Provides granular tracking of resident presence across three daily dining sessions (Breakfast, Lunch, Dinner) as well as daily hostel residency roll-calls.\nPriority: High.")
    add_h3(doc, "4.4.2 Stimulus/Response Sequences")
    add_bullet(doc, "The supervisor navigates to the attendance portal (/warden/attendance or /mess-manager/attendance).", bold_prefix="Warden / Manager Action: ")
    add_bullet(doc, "The system renders the registered student resident roster. Each student card displays meal session status indicators.", bold_prefix="Roster Display: ")
    add_bullet(doc, "The supervisor clicks the 'Present' or 'Absent' segmented toggle button for a resident.", bold_prefix="Toggle Event: ")
    add_bullet(doc, "System performs an optimistic UI update, changes the badge to active green or neutral crimson, and dispatches a background POST request to /api/attendance with student_id, date, meal_type, and present (boolean).", bold_prefix="System Response: ")
    add_bullet(doc, "The server performs an INSERT ... ON DUPLICATE KEY UPDATE query, updating existing logs or inserting new entries.", bold_prefix="Database Processing: ")
    add_bullet(doc, "The student attendance view (/student/attendance) recalculates overall attendance percentage: (Total Present Sessions / Total Evaluated Sessions) * 100, flagging compliance against the 75% benchmark.", bold_prefix="Student Calculation: ")
    add_h3(doc, "4.4.3 Functional Requirements")
    add_bullet(doc, "The system shall support attendance tracking across discrete meal types: BREAKFAST, LUNCH, DINNER, and general DAILY roll-call.", bold_prefix="REQ-ATTN-01: ")
    add_bullet(doc, "Attendance records shall be uniquely constrained by the composite key (student_id, date, meal_type).", bold_prefix="REQ-ATTN-02: ")
    add_bullet(doc, "The system shall maintain optimistic UI updates allowing supervisors to record rapid check-ins during high-volume dining hall entry without interface freezing.", bold_prefix="REQ-ATTN-03: ")
    add_bullet(doc, "The student dashboard shall compute overall percentage turnout and display warning indicators if attendance drops below 75%.", bold_prefix="REQ-ATTN-04: ")

    # Feature 4.5
    add_h2(doc, "4.5 Digital Leave Application and Warden Approval")
    add_h3(doc, "4.5.1 Description and Priority")
    add_p(doc, "Manages student requests for overnight campus departures, weekend out-passes, and vacation leaves, replacing paper leave slips with an audited digital workflow.\nPriority: High.")
    add_h3(doc, "4.5.2 Stimulus/Response Sequences")
    add_bullet(doc, "Student accesses /student/leave, enters departure date (from_date), return date (to_date), and comprehensive reason/destination, and submits.", bold_prefix="Student Application: ")
    add_bullet(doc, "System validates that to_date >= from_date, inserts record into LEAVE_APPLICATION with status PENDING, and sets applied_date = CURRENT_TIMESTAMP.", bold_prefix="Backend Submission: ")
    add_bullet(doc, "Warden opens /warden/leave-requests. The pending request queue highlights the student's name, roll number, requested date range, and reason.", bold_prefix="Warden Review: ")
    add_bullet(doc, "Warden clicks 'Approve' or 'Reject'. System dispatches PUT request to /api/warden/leaves/:id updating status to APPROVED or REJECTED.", bold_prefix="Decision Execution: ")
    add_bullet(doc, "Student application table updates immediately to display an approved green pill badge or rejected crimson badge.", bold_prefix="Real-time Status Update: ")
    add_h3(doc, "4.5.3 Functional Requirements")
    add_bullet(doc, "The system shall validate that leave return dates are chronologically equal to or subsequent to the departure date.", bold_prefix="REQ-LEAVE-01: ")
    add_bullet(doc, "All submitted leave applications shall default to the PENDING review state.", bold_prefix="REQ-LEAVE-02: ")
    add_bullet(doc, "Only authenticated users with the Warden role shall have authorization to transition leave application states to APPROVED or REJECTED.", bold_prefix="REQ-LEAVE-03: ")
    add_bullet(doc, "The system shall preserve a permanent chronological audit log of all historical leave decisions.", bold_prefix="REQ-LEAVE-04: ")

    # Feature 4.6
    add_h2(doc, "4.6 Fee Ledger, Billing Reports, and Arrears Audit")
    add_h3(doc, "4.6.1 Description and Priority")
    add_p(doc, "Audits hostel room fees, mess catering dues, and miscellaneous charges, tracking payment settlements and outstanding student arrears.\nPriority: High.")
    add_h3(doc, "4.6.2 Stimulus/Response Sequences")
    add_bullet(doc, "Warden or Mess Manager opens /fees/report.", bold_prefix="Ledger Audit: ")
    add_bullet(doc, "Server queries the FEE table grouped by student, calculating SUM(amount) as Total Assessed, SUM(amount WHERE status = 'PAID') as Amount Cleared, and the difference as Outstanding Arrears.", bold_prefix="Aggregated Processing: ")
    add_bullet(doc, "The report renders KPI metric cards: Total Assessed Revenue, Total Collected, Total Outstanding, and percentage Collection Rate.", bold_prefix="Interface Render: ")
    add_bullet(doc, "Supervisors filter between 'All Records', 'Cleared Accounts', and 'Pending Dues', or execute real-time searches by roll number or student name.", bold_prefix="Filtering: ")
    add_h3(doc, "4.6.3 Functional Requirements")
    add_bullet(doc, "The system shall track individual fee line items with amount, fee category, due date, and payment status (PAID, PENDING).", bold_prefix="REQ-FEE-01: ")
    add_bullet(doc, "The system shall automatically compute student balance arrears and identify students with zero dues versus outstanding debt.", bold_prefix="REQ-FEE-02: ")
    add_bullet(doc, "Fee reports shall provide instant search filtering across roll numbers, student names, and payment status categories.", bold_prefix="REQ-FEE-03: ")

    # Feature 4.7
    add_h2(doc, "4.7 Facility Maintenance and Grievance Ticketing")
    add_h3(doc, "4.7.1 Description and Priority")
    add_p(doc, "Allows residents to report room fixture defects, electrical failures, plumbing problems, or food hygiene grievances, and empowers Wardens to log inspections and resolutions.\nPriority: Medium.")
    add_h3(doc, "4.7.2 Stimulus/Response Sequences")
    add_bullet(doc, "Student accesses /student/complaints, selects category (ROOM, MAINTENANCE, MESS, OTHER), inputs problem description, and submits.", bold_prefix="Ticket Logging: ")
    add_bullet(doc, "System normalizes category input against database ENUM values, inserts record into COMPLAINT with status OPEN.", bold_prefix="Backend Processing: ")
    add_bullet(doc, "Warden views /warden/complaints, filters by OPEN or RESOLVED, clicks 'Mark Resolved', inputs administrative resolution notes, and saves.", bold_prefix="Warden Resolution: ")
    add_bullet(doc, "System updates ticket with status = 'RESOLVED', resolved_date = NOW(), and stores resolution notes for student review.", bold_prefix="Resolution Recording: ")
    add_h3(doc, "4.7.3 Functional Requirements")
    add_bullet(doc, "The system shall accept grievance tickets categorized under ROOM, MAINTENANCE, MESS, or OTHER.", bold_prefix="REQ-COMP-01: ")
    add_bullet(doc, "All newly submitted tickets shall initialize with status = 'OPEN'.", bold_prefix="REQ-COMP-02: ")
    add_bullet(doc, "Wardens shall be required to input resolution notes when marking a complaint as resolved.", bold_prefix="REQ-COMP-03: ")

    # Feature 4.8
    add_h2(doc, "4.8 Mess Dining Menu and Catering Operations")
    add_h3(doc, "4.8.1 Description and Priority")
    add_p(doc, "Displays the official institutional meal timetable across breakfast, lunch, evening snacks, and dinner, specifying timings and dietary categories.\nPriority: Medium.")
    add_h3(doc, "4.8.2 Functional Requirements")
    add_bullet(doc, "The system shall maintain scheduled meal menu timetables across four standardized daily dining sessions: Breakfast, Lunch, Evening Snacks, and Dinner.", bold_prefix="REQ-MESS-01: ")
    add_bullet(doc, "The system shall display specific serving time windows and dietary classifications (e.g., South Indian Special, Full Thali Meal).", bold_prefix="REQ-MESS-02: ")
    add_bullet(doc, "The student mess portal shall provide institutional food safety guidelines, catering certifications, and special sick diet request protocols.", bold_prefix="REQ-MESS-03: ")

    # Feature 4.9
    add_h2(doc, "4.9 Supervisory Staff Provisioning and Administrative Governance")
    add_h3(doc, "4.9.1 Description and Priority")
    add_p(doc, "Enables System Administrators to appoint, configure, and decommission supervisory personnel (Wardens and Mess Managers).\nPriority: High.")
    add_h3(doc, "4.9.2 Functional Requirements")
    add_bullet(doc, "The system shall allow Administrators to create new user accounts assigned with WARDEN or MESS_MANAGER roles.", bold_prefix="REQ-ADM-01: ")
    add_bullet(doc, "The system shall provide deletion capabilities for decommissioned staff accounts with referential integrity enforcement.", bold_prefix="REQ-ADM-02: ")
    add_bullet(doc, "The Admin dashboard shall display aggregate institution-wide KPI statistics: Total Enrolled Students, Active Wardens, Mess Managers, and Hostel Room Inventory.", bold_prefix="REQ-ADM-03: ")

    # ==================== 5. OTHER NONFUNCTIONAL REQUIREMENTS ====================
    add_h1(doc, "5. Other Nonfunctional Requirements")
    
    add_h2(doc, "5.1 Performance Requirements")
    add_bullet(doc, "The REST API backend shall process and respond to 95% of standard read queries within 250 milliseconds under standard campus network loads.", bold_prefix="Response Latency: ")
    add_bullet(doc, "Initial Single Page Application bundle load and first contentful paint (FCP) shall complete within 1.2 seconds on standard broadband connections.", bold_prefix="Client Render Speed: ")
    add_bullet(doc, "The system architecture shall support a minimum of 500 concurrent active user sessions without service degradation or database thread exhaustion.", bold_prefix="Concurrent Load Capacity: ")
    add_bullet(doc, "Interactive roll-call and meal check-in buttons shall reflect state changes within 50 milliseconds on the client interface to support rapid dining hall queues.", bold_prefix="Optimistic State Updates: ")

    add_h2(doc, "5.2 Safety Requirements")
    add_bullet(doc, "All database write operations modifying student residential status, bed allocations, or payment receipts must be committed within transactional boundaries (ACID) to prevent partial state corruption during hardware failure.", bold_prefix="Data Loss Prevention: ")
    add_bullet(doc, "Guardian contact phone numbers stored in the STUDENT table must be strictly preserved without truncation to ensure immediate availability during campus medical emergencies.", bold_prefix="Emergency Contact Integrity: ")

    add_h2(doc, "5.3 Security Requirements")
    add_bullet(doc, "User passwords must never be stored in plaintext. Passwords must be hashed using strong cryptographic hashing algorithms (bcrypt with a minimum work factor of 10).", bold_prefix="Credential Storage: ")
    add_bullet(doc, "All protected API endpoints must validate incoming JWT tokens against signature corruption, tampering, and expiration.", bold_prefix="Cryptographic Token Verification: ")
    add_bullet(doc, "Backend routes must enforce strict role verification middleware: /api/admin/* restricted to ADMIN, /api/warden/* restricted to WARDEN, /api/mess-manager/* restricted to MESS_MANAGER, and /api/student/* restricted to STUDENT.", bold_prefix="Role-Based Authorization: ")
    add_bullet(doc, "All SQL queries interacting with the MySQL database must utilize prepared statements with parameterized queries (? placeholders). No string concatenation of user inputs into SQL strings is permitted.", bold_prefix="SQL Injection Prevention: ")
    add_bullet(doc, "React's virtual DOM natively escapes HTML entity inputs, preventing execution of injected script tags in student complaint or leave text fields.", bold_prefix="Cross-Site Scripting (XSS) Sanitization: ")

    add_h2(doc, "5.4 Software Quality Attributes")
    add_bullet(doc, "The system shall maintain an operational availability of 99.5% during academic semesters, scheduling administrative maintenance during off-peak hours (02:00 AM - 04:00 AM).", bold_prefix="Availability: ")
    add_bullet(doc, "Source code must adhere to clean modular separation: frontend reusable UI tokens isolated in src/components/ui/, backend routers decoupled from controller business logic, and database configs centralized in config/db.js.", bold_prefix="Maintainability: ")
    add_bullet(doc, "The UI must adhere to modern SaaS visual guidelines, utilizing high-contrast typography, clear status pill badges, and accessible form labels compliant with WCAG 2.1 Level AA standards.", bold_prefix="Usability: ")
    add_bullet(doc, "The entire application stack must execute consistently across standard operating systems (Windows, Linux, macOS) without modification to underlying application source code.", bold_prefix="Portability: ")

    add_h2(doc, "5.5 Business Rules")
    add_bullet(doc, "Institutional regulations mandate that student residents maintain an aggregate attendance turnout of at least 75% across academic terms to retain hostel accommodation eligibility.", bold_prefix="Rule 1 (Attendance Threshold): ")
    add_bullet(doc, "A student resident may be allocated to at most one hostel room at any given point in time.", bold_prefix="Rule 2 (Single Room Allocation): ")
    add_bullet(doc, "The total number of active student residents allocated to a room shall never exceed the defined physical bed capacity of that room.", bold_prefix="Rule 3 (Bed Capacity Cap): ")
    add_bullet(doc, "A leave out-pass return date must be chronologically equal to or greater than the departure date.", bold_prefix="Rule 4 (Chronological Leave Integrity): ")
    add_bullet(doc, "Only appointed Wardens are legally authorized to review, approve, or reject student residential leave applications.", bold_prefix="Rule 5 (Warden Authorization): ")

    # ==================== 6. OTHER REQUIREMENTS ====================
    add_h1(doc, "6. Other Requirements")
    
    add_h2(doc, "6.1 Conceptual Data Model and Relational Schemas")
    add_p(doc, "The HMMS database schema is normalized to Third Normal Form (3NF) to guarantee transactional integrity and eliminate update anomalies.")
    
    add_h3(doc, "Relational Entity Descriptions")
    add_bullet(doc, "Represents all system actors. Stores user_id (INT, PK), username (VARCHAR(100)), email (VARCHAR(100), UQ), password (VARCHAR(255)), role (ENUM: ADMIN, WARDEN, MESS_MANAGER, STUDENT), phone (VARCHAR(20)), created_at (TIMESTAMP).", bold_prefix="1. USER: ")
    add_bullet(doc, "Specialized entity for residents. Stores student_id (INT, PK), user_id (INT, FK -> USER), roll_no (VARCHAR(50), UQ), department (VARCHAR(100)), year_of_study (INT), room_id (INT, FK -> ROOM), guardian_contact (VARCHAR(20)).", bold_prefix="2. STUDENT: ")
    add_bullet(doc, "Supervisory personnel. Stores warden_id (INT, PK), user_id (INT, FK -> USER), hostel_block (VARCHAR(50)).", bold_prefix="3. WARDEN: ")
    add_bullet(doc, "Dining supervisor. Stores manager_id (INT, PK), user_id (INT, FK -> USER), mess_name (VARCHAR(100)).", bold_prefix="4. MESS_MANAGER: ")
    add_bullet(doc, "Hostel residential rooms. Stores room_id (INT, PK), room_number (VARCHAR(20), UQ), room_type (ENUM: SINGLE, DOUBLE, TRIPLE), capacity (INT), occupied_count (INT), status (ENUM: AVAILABLE, FULL).", bold_prefix="5. ROOM: ")
    add_bullet(doc, "Multi-session dining and roll-call. Stores attendance_id (INT, PK), student_id (INT, FK -> STUDENT), date (DATE), meal_type (ENUM: BREAKFAST, LUNCH, DINNER, DAILY), present (BOOLEAN). Composite unique key on (student_id, date, meal_type).", bold_prefix="6. ATTENDANCE: ")
    add_bullet(doc, "Out-pass departure requests. Stores leave_id (INT, PK), student_id (INT, FK -> STUDENT), from_date (DATE), to_date (DATE), reason (TEXT), status (ENUM: PENDING, APPROVED, REJECTED), applied_date (TIMESTAMP).", bold_prefix="7. LEAVE_APPLICATION: ")
    add_bullet(doc, "Student billing ledgers. Stores fee_id (INT, PK), student_id (INT, FK -> STUDENT), amount (DECIMAL(10,2)), fee_type (VARCHAR(50)), due_date (DATE), status (ENUM: PAID, PENDING, UNPAID), paid_date (TIMESTAMP).", bold_prefix="8. FEE: ")
    add_bullet(doc, "Maintenance and grievance tickets. Stores complaint_id (INT, PK), student_id (INT, FK -> STUDENT), resolved_by (INT, FK -> WARDEN), category (ENUM: ROOM, MESS, MAINTENANCE, OTHER), description (TEXT), status (ENUM: OPEN, IN_PROGRESS, RESOLVED, REJECTED), submitted_date (TIMESTAMP), resolved_date (TIMESTAMP), resolution_notes (TEXT).", bold_prefix="9. COMPLAINT: ")

    add_p(doc, "", space_after=6)
    add_h3(doc, "Entity Relationship Mapping Table")
    
    table_erm = doc.add_table(rows=10, cols=5)
    table_erm.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_erm.autofit = False
    set_table_borders(table_erm)
    
    erm_widths = [Inches(1.1), Inches(0.8), Inches(1.3), Inches(2.1), Inches(1.2)]
    for row in table_erm.rows:
        for idx, width in enumerate(erm_widths):
            row.cells[idx].width = width
            set_cell_margins(row.cells[idx], top=60, bottom=60, left=80, right=80)
            
    erm_headers = ["Source Entity", "Cardinality", "Target Entity", "Relationship Description", "Integrity Rule"]
    for idx, text in enumerate(erm_headers):
        cell = table_erm.rows[0].cells[idx]
        set_cell_shading(cell, "F0F0F0")
        p = cell.paragraphs[0]
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10)
        r.font.bold = True
        
    erm_data = [
        ("USER", "1 : 1", "STUDENT", "User credentials map to resident profile", "ON DELETE CASCADE"),
        ("USER", "1 : 1", "WARDEN", "User credentials map to warden profile", "ON DELETE CASCADE"),
        ("USER", "1 : 1", "MESS_MANAGER", "User credentials map to dining manager", "ON DELETE CASCADE"),
        ("ROOM", "1 : N", "STUDENT", "Room houses multiple residents up to capacity", "ON DELETE SET NULL"),
        ("STUDENT", "1 : N", "ATTENDANCE", "Student accumulates multi-session roll-calls", "ON DELETE CASCADE"),
        ("STUDENT", "1 : N", "LEAVE_APP", "Student files chronological leave out-passes", "ON DELETE CASCADE"),
        ("STUDENT", "1 : N", "FEE", "Student is assessed semester fee invoices", "ON DELETE CASCADE"),
        ("STUDENT", "1 : N", "COMPLAINT", "Student logs maintenance grievance tickets", "ON DELETE CASCADE"),
        ("WARDEN", "1 : N", "COMPLAINT", "Warden inspects and resolves tickets", "ON DELETE SET NULL")
    ]
    for row_idx, data in enumerate(erm_data, start=1):
        for col_idx, text in enumerate(data):
            cell = table_erm.rows[row_idx].cells[col_idx]
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.5)
            if col_idx in [0, 2]:
                r.font.bold = True

    add_p(doc, "", space_after=6)
    add_h2(doc, "6.2 Data Backup and Disaster Recovery Strategy")
    add_bullet(doc, "The system utilizes native mysqldump utilities scheduled via server cron jobs to generate daily compressed .sql.gz snapshots of the HMMS database at 03:00 AM UTC.", bold_prefix="1. Automated Logical Backups: ")
    add_bullet(doc, "MySQL binary logging (binlog) is enabled to allow database restoration to any precise second preceding an accidental administrative deletion.", bold_prefix="2. Point-in-Time Recovery (PITR): ")
    add_bullet(doc, "Quarterly mock restoration tests are executed on staging servers to verify backup integrity and validate recovery time objectives (RTO < 1 hour, RPO < 24 hours).", bold_prefix="3. Restoration Verification: ")

    add_h2(doc, "6.3 Security Considerations and Hardening")
    add_bullet(doc, "Database credentials, JWT secret keys, and server port allocations are strictly isolated within uncommitted .env files.", bold_prefix="Environment Isolation: ")
    add_bullet(doc, "Backend controllers sanitize all user payloads and validate enumeration values prior to database query execution, eliminating uncaught runtime exceptions.", bold_prefix="Strict Parameter Normalization: ")
    add_bullet(doc, "Client-side authentication tokens are verified on every view transition; expired or tampered tokens result in immediate memory clearance and redirection to the portal login screen.", bold_prefix="Session Expiration: ")

    add_h2(doc, "6.4 Future System Enhancements")
    add_bullet(doc, "Incorporating Razorpay/Stripe webhooks for online student fee settlement via UPI, credit/debit cards, and net banking.", bold_prefix="Automated Payment Gateway Integration: ")
    add_bullet(doc, "Interfacing physical fingerprint scanners or RFID smart-card turnstiles at dining hall entries with the attendance logging endpoint.", bold_prefix="Biometric Hardware Integration: ")
    add_bullet(doc, "Automated SMS alerts dispatched to parents upon Warden approval of overnight student leave out-passes.", bold_prefix="SMS / Push Notifications: ")

    # ==================== APPENDIX: ANALYSIS OF MODELS ====================
    doc.add_page_break()
    
    # 11 Diagrams list with filenames and formal titles
    diagram_specs = [
        ("Use Case Diagram", "1084 HostelMess.png"),
        ("Class Diagram", "Hostel Mess 084 ClassDiagram.png"),
        ("Sequence Diagram", "84_HMMS_SEQUENCE.png"),
        ("Collaboration Diagram", "84_HMMS_COLLABORATION.png"),
        ("State Chart Diagram", "84_HMMS_STATE_CHART.png"),
        ("Activity Diagram", "084_ACTIVITY_DIAGRAM_HMMS.png"),
        ("Component Diagram", "084_HMMS_COMPONENT.png"),
        ("Deployment Diagram", "084_HMMS_DEPLOYMENT.png"),
        ("Entity Relationship (ER) Diagram", "84_HMMS_ER.png"),
        ("Data Flow Diagram (DFD) - Level 0", "84_HMMS_DFDLVL_0.png"),
        ("Data Flow Diagram (DFD) - Level 1", "84_HMMS_DFDLVL_1.png")
    ]
    
    for idx, (title, filename) in enumerate(diagram_specs):
        img_path = os.path.join(DIAGRAMS_DIR, filename)
        if not os.path.exists(img_path):
            print(f"Warning: image {img_path} not found!")
            continue
            
        # Top heading on first diagram page: "Appendix : Analysis Of Models"
        if idx == 0:
            p_app_head = doc.add_paragraph()
            p_app_head.paragraph_format.space_before = Pt(0)
            p_app_head.paragraph_format.space_after = Pt(16)
            r = p_app_head.add_run("Appendix : Analysis Of Models")
            r.font.name = "Times New Roman"
            r.font.size = Pt(16)
            r.font.bold = True
            
        # Diagram Title
        p_dtitle = doc.add_paragraph()
        p_dtitle.alignment = WD_ALIGN_PARAGRAPH.LEFT if idx == 0 else WD_ALIGN_PARAGRAPH.CENTER
        p_dtitle.paragraph_format.space_before = Pt(8)
        p_dtitle.paragraph_format.space_after = Pt(14)
        p_dtitle.paragraph_format.keep_with_next = True
        r = p_dtitle.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(16)
        r.font.bold = True
        
        # Calculate optimal image scale to prevent page spillover
        im = Image.open(img_path)
        w_px, h_px = im.size
        aspect = w_px / h_px
        
        # Printable area is 6.5 in wide, max ~7.0 in high for image
        max_w = 6.2
        max_h = 6.8 if idx > 0 else 5.8 # first page has appendix title too
        
        # Scale to fit comfortably
        if (max_w / aspect) > max_h:
            target_h = Inches(max_h)
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(0)
            p_img.paragraph_format.space_after = Pt(12)
            run_img = p_img.add_run()
            run_img.add_picture(img_path, height=target_h)
        else:
            target_w = Inches(max_w)
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(0)
            p_img.paragraph_format.space_after = Pt(12)
            run_img = p_img.add_run()
            run_img.add_picture(img_path, width=target_w)
            
        # Add page break after each diagram
        doc.add_page_break()

    # ==================== DEMONSTRATION (SCREENSHOTS SECTION) ====================
    # As explicitly requested:
    # "for screenshot make the blank space with the nmae screenshiot to be attached"
    # Matches pages 40-46 of REFERENCE.pdf (2 screenshots per page, bold caption below each)
    
    p_demo_head = doc.add_paragraph()
    p_demo_head.paragraph_format.space_before = Pt(0)
    p_demo_head.paragraph_format.space_after = Pt(14)
    r = p_demo_head.add_run("Demonstration")
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    
    demo_screens = [
        ("Login page", "Student Registration & Room Allocation page"),
        ("Student Dashboard", "Digital Mess Pass & QR Code Verification"),
        ("Mess Cut / Rebate Application & Status", "Fee Ledger, Arrears & Payment Portal"),
        ("Attendance & Movement Logging Screen", "Leave & Night-Out Pass Workflow"),
        ("Maintenance & Grievance Ticketing Portal", "Warden & Administration Oversight Dashboard"),
        ("Mess Dining Menu & Inventory Screen", "Institutional Audit & Room Occupancy Report")
    ]
    
    for page_idx, (screen1, screen2) in enumerate(demo_screens):
        add_screenshot_box(doc, screen1, height_in=2.7, placeholder_text="Screenshot to be attached")
        add_screenshot_box(doc, screen2, height_in=2.7, placeholder_text="Screenshot to be attached")
        
        if page_idx < len(demo_screens) - 1:
            doc.add_page_break()

    # Save final document
    print(f"Saving final document to {OUT_DOCX}...")
    doc.save(OUT_DOCX)
    print("Done! Document successfully generated.")

if __name__ == "__main__":
    main()
