import React from "react";
import { Container, Paper, Typography, Avatar, Box, Grid } from "@mui/material";
import { useTeamStore } from "../store/teamStore";

const TeamPage: React.FC = () => {
  const teamMembers = useTeamStore((state) => state.teamMembers);
  // Giả sử không cần collapsed/setCollapsed ở đây, có thể bổ sung nếu muốn đồng bộ layout
  return (
      <Container maxWidth={false} sx={{ my: 4, }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Thành viên Team
          </Typography>
          <Grid container spacing={3}>
            {teamMembers.map((member) => (
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={member.photo} alt={member.full_name_display || member.username} sx={{ width: 56, height: 56 }}>
                    {(member.full_name_display || member.username).charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{member.full_name_display || member.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                  </Box>
                </Box>
            ))}
          </Grid>
        </Paper>
      </Container>
  );
};

export default TeamPage; 