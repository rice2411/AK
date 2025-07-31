import React from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';

const docs = [
  { name: "ReviewResult", url: "https://rikkeisoft0-my.sharepoint.com/:x:/g/personal/hieudt_rikkeisoft_com/ERgyl9h1M1BZ3EoB6NhSzNABz4ssjKyqkuj6OGrOWyzXWw?e=VY0fCG" },
  { name: "Tracking task", url: "https://rikkeisoft0-my.sharepoint.com/:x:/r/personal/binhlt2_rikkeisoft_com/_layouts/15/Doc.aspx?sourcedoc=%7BE05DFD9E-194C-5EC0-53AC-214CD82A8FD0%7D&file=Tracking%20task%20AK_DN.xlsx&action=default&mobileredirect=true" },
  { name: "Log work time", url: "https://drive.google.com/drive/folders/1VNomMJ8qRLL8uN39nsqPKvDXOEU0TU9x" },
  { name: "File Server", url: "https://rikkeisoft0.sharepoint.com/sites/FileServer/File%20Server/Forms/AllItems.aspx?e=5%3A53f08c926d4343b88cd86e7aaf368063&sharingv2=true&fromShare=true&at=9&CT=1713945267358&OR=OWA%2DNT%2DMail&CID=ff68a068%2D2648%2D9390%2D446d%2D210ac1c19297&FolderCTID=0x012000C08534137A4F7C4DBCC3FA071F36789C&id=%2Fsites%2FFileServer%2FFile%20Server%2FDN3%2FData%20Project%2FT%5FAK%5FDN%2FT%5FAK%5FDN" },
  { name: "Xem bảng xếp hạng", url: "https://integ-prod-flextest.madp.tm.softbank.jp/apps/matching/#_frmLoginLongDH@twinger.vn/Rikkei231023#@" },
];

const tabData = [
  { label: 'Tài liệu chung', docs },
  { label: 'Tài liệu dự án', docs },
  { label: 'Tài liệu nội bộ', docs },
];

const InternalDocsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ mb: 4, p: 4 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        sx={{
          mb: { xs: 2, md: 3 },
          fontWeight: 600,
          color: "black",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Tài liệu nội bộ
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: '1px solid #e0e0e0' }}
      >
        {tabData.map((t) => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>
      
      <Paper 
        elevation={0}
        sx={{ 
          overflow: 'hidden',
        }}
      >
        <List sx={{ p: 0 }}>
          {tabData[tab].docs.map((doc, index) => (
            <React.Fragment key={doc.name}>
              <ListItem
                component="button"
                onClick={() => window.open(doc.url, '_blank', 'noopener noreferrer')}
                sx={{
                  py: 2,
                  px: 3,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  '&:active': {
                    backgroundColor: '#e0e0e0',
                  },
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderRadius: '0px',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DescriptionIcon 
                    sx={{ 
                      fontSize: 28, 
                      color: '#1976d2',
                    }} 
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: '#1976d2',
                        fontSize: 16,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {doc.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#666',
                        fontSize: 12,
                        mt: 0.5,
                        display: 'block',
                      }}
                    >
                      {doc.url.length > 1000 ? `${doc.url.substring(0, 80)}...` : doc.url}
                    </Typography>
                  }
                />
              </ListItem>
              {index < tabData[tab].docs.length - 1 && (
                <Divider  />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default InternalDocsPage; 