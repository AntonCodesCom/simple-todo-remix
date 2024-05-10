import { Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';

// meta
export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Todo' },
    { name: 'description', content: 'Remix Todo app.' },
  ];
};

// sub-component
function CheckboxList() {
  const [checked, setChecked] = useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            secondaryAction={
              <>
                <IconButton size="small" aria-label="comments">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton edge="end" size="small" aria-label="comments">
                  <Delete fontSize="small" />
                </IconButton>
              </>
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

const todos = [
  {
    label: 'Lorem ipsum dolor sit amet.',
  },
  {
    label: 'Todo 2',
  },
];

/**
 * Index (root) route component.
 */
export default function RouteIndex() {
  return (
    <Container>
      <Typography variant="h4" component="h1" mb={3}>
        My Todos
      </Typography>
      <TableContainer>
        <Table sx={{ width: 'auto' }}>
          <TableBody>
            {todos.map((x, i) => {
              const htmlId = `TodoListItem${i}`;
              return (
                <TableRow key={i}>
                  <TableCell padding="checkbox">
                    <Checkbox id={htmlId} />
                  </TableCell>
                  <TableCell>
                    <label htmlFor={htmlId} style={{ cursor: 'pointer' }}>
                      {x.label}
                    </label>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Edit fontSize="small" />
                    </IconButton>{' '}
                    <IconButton size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
